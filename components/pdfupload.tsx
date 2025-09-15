'use client';

import { useState } from 'react';
import pdfToText from 'react-pdftotext';
import { ClaudeAnalysis, ViewMode } from './types';
import EventListView from './EventListView';
import CalendarView from './CalendarView';
import Instructions from './Instructions';
import { useRouter } from 'next/navigation';

export default function PDFUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [claudeAnalysis, setClaudeAnalysis] = useState<ClaudeAnalysis | null>(
    null
  );
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setText('');
      setClaudeAnalysis(null);
    }
  };

  const processSyllabus = async () => {
    if (!file) {
      alert('Please select a PDF file first!');
      return;
    }

    setIsLoading(true);
    setText('');
    setClaudeAnalysis(null);

    try {
      // Step 1: Extract PDF text on the client
      const extractedText = await pdfToText(file);
      setText(extractedText);

      // Step 2: Analyze the extracted text on the server
      const analyzeResponse = await fetch('/api/analyze-syllabus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ syllabusText: extractedText }),
      });

      const analyzeResult = await analyzeResponse.json();

      if (analyzeResult.success) {
        if (analyzeResult.analysis?.error === true) {
          const reason =
            analyzeResult.analysis?.message ||
            'This does not appear to be a course syllabus.';
          alert(reason);
          return;
        }
        setClaudeAnalysis(analyzeResult.analysis);
      } else {
        alert('Error analyzing syllabus: ' + analyzeResult.error);
      }
    } catch (error) {
      alert('Something went wrong! Please try again.');
      console.error('Processing error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSyllabus = async () => {
    if (!claudeAnalysis) return;

    setIsSaving(true);
    try {
      // Get existing syllabi from localStorage
      const existingSyllabi = JSON.parse(
        localStorage.getItem('savedSyllabi') || '[]'
      );

      // Add new syllabus
      const updatedSyllabi = [...existingSyllabi, claudeAnalysis];

      // Save to localStorage
      localStorage.setItem('savedSyllabi', JSON.stringify(updatedSyllabi));

      alert('Syllabus saved successfully!');
      router.push('/');
    } catch (error) {
      alert('Failed to save syllabus. Please try again.');
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSyllabus = () => {
    if (
      window.confirm(
        'Are you sure you want to delete this analysis? This action cannot be undone.'
      )
    ) {
      setClaudeAnalysis(null);
      setFile(null);
      setText('');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Syllabus Analyzer</h1>

      <div className="bg-white border rounded-lg p-6 mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select PDF File
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 p-2"
            disabled={isLoading}
            aria-label="Select PDF file"
          />
        </div>

        {file && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <p className="text-green-800 font-medium">
                Selected: {file.name}
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={processSyllabus}
            disabled={!file || isLoading}
            className={`px-6 py-2 rounded font-medium ${
              !file || isLoading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </div>
            ) : (
              'Process Syllabus'
            )}
          </button>
        </div>
      </div>

      {claudeAnalysis && (
        <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-8 mb-8 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Analysis Results
            </h2>
            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                  viewMode === 'list'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                }`}
              >
                List View
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                  viewMode === 'calendar'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                }`}
              >
                Calendar View
              </button>
            </div>
          </div>

          <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
            <h3 className="font-bold text-blue-900 mb-4 text-lg">
              📚 Course Information
            </h3>
            <p className="text-black">
              <strong>Course:</strong> {claudeAnalysis.courseName}
            </p>
            <p className="text-black">
              <strong>Instructor:</strong> {claudeAnalysis.instructor}
            </p>
            <p className="text-black">
              <strong>Semester:</strong> {claudeAnalysis.semester}
            </p>
            <p className="text-black">
              <strong>Total Events:</strong> {claudeAnalysis.totalEvents}
            </p>
          </div>

          {claudeAnalysis.gradeBreakdown &&
            claudeAnalysis.gradeBreakdown.length > 0 && (
              <div className="mb-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                <h3 className="font-bold text-green-900 mb-4 text-lg">
                  📊 Grading Breakdown
                </h3>
                <div className="space-y-1">
                  {claudeAnalysis.gradeBreakdown.map((grade, index) => (
                    <p key={index} className="text-black">
                      <strong>{grade.category}:</strong> {grade.percentage}%
                    </p>
                  ))}
                </div>
              </div>
            )}

          {viewMode === 'calendar' ? (
            <CalendarView events={claudeAnalysis.events} />
          ) : (
            <EventListView events={claudeAnalysis.events} />
          )}

          {/* Save/Delete Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
            <button
              onClick={handleDeleteSyllabus}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              🗑️ Delete Analysis
            </button>
            <button
              onClick={handleSaveSyllabus}
              disabled={isSaving}
              className={`px-8 py-3 font-semibold rounded-xl transition-all duration-200 transform ${
                isSaving
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed scale-95'
                  : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white hover:scale-105 shadow-lg hover:shadow-xl'
              }`}
            >
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </div>
              ) : (
                '💾 Save to Dashboard'
              )}
            </button>
          </div>
        </div>
      )}

      <Instructions />
    </div>
  );
}
