'use client';

import { useState } from 'react';
import { ClaudeAnalysis, ViewMode } from './types';
import EventListView from './EventListView';
import CalendarView from './CalendarView';

export default function PDFUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [claudeAnalysis, setClaudeAnalysis] = useState<ClaudeAnalysis | null>(
    null
  );
  const [viewMode, setViewMode] = useState<ViewMode>('list');

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
      // Step 1: Extract PDF text
      const formData = new FormData();
      formData.append('pdf', file);

      const extractResponse = await fetch('/api/extract-pdf', {
        method: 'POST',
        body: formData,
      });

      const extractResult = await extractResponse.json();

      if (!extractResult.success) {
        setText('Error: ' + extractResult.error);
        return;
      }

      setText(extractResult.text);

      // Step 2: Analyze the extracted text
      const analyzeResponse = await fetch('/api/analyze-syllabus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ syllabusText: extractResult.text }),
      });

      const analyzeResult = await analyzeResponse.json();

      if (analyzeResult.success) {
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

        {file && <p className="text-green-600 mb-4">Selected: {file.name}</p>}

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
            {isLoading ? 'Processing...' : 'Process Syllabus'}
          </button>
        </div>
      </div>

      {claudeAnalysis && (
        <div className="bg-white border rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Analysis Results
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded text-sm font-medium ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                List View
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-4 py-2 rounded text-sm font-medium ${
                  viewMode === 'calendar'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Calendar View
              </button>
            </div>
          </div>

          <div className="mb-4 p-4 bg-blue-50 rounded">
            <h3 className="font-semibold text-blue-800 mb-2">
              Course Information
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
              <div className="mb-4 p-4 bg-green-50 rounded">
                <h3 className="font-semibold text-green-800 mb-2">
                  Grading Breakdown
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
        </div>
      )}

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">How it works:</h3>
        <ol className="text-sm text-blue-700 space-y-1">
          <li>1. Choose a PDF file (your course syllabus)</li>
          <li>2. Click Process Syllabus to extract and analyze everything</li>
          <li>3. View your course calendar and information!</li>
        </ol>
      </div>
    </div>
  );
}
