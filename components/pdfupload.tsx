'use client';

import { useState } from 'react';

interface CalendarEvent {
  date: string;
  title: string;
  type:
    | 'assignment'
    | 'exam'
    | 'quiz'
    | 'project'
    | 'reading'
    | 'class'
    | 'other';
  description: string;
  week?: number;
}

interface GradeBreakdown {
  category: string;
  percentage: number;
}

interface ClaudeAnalysis {
  courseName: string;
  instructor: string;
  semester: string;
  gradeBreakdown: GradeBreakdown[];
  events: CalendarEvent[];
  totalEvents: number;
  error: boolean;
}

export default function PDFUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [claudeAnalysis, setClaudeAnalysis] = useState<ClaudeAnalysis | null>(
    null
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setText('');
      setClaudeAnalysis(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a PDF file first!');
      return;
    }

    setIsLoading(true);
    setText('');
    setClaudeAnalysis(null);

    try {
      const formData = new FormData();
      formData.append('pdf', file);

      const response = await fetch('/api/extract-pdf', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setText(result.text);
      } else {
        setText('Error: ' + result.error);
      }
    } catch (error) {
      setText('Something went wrong! Please try again.');
      console.error('Upload error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeDatesWithClaude = async () => {
    if (!text) {
      alert('Please extract PDF text first!');
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/analyze-syllabus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ syllabusText: text }),
      });

      const result = await response.json();

      if (result.success) {
        setClaudeAnalysis(result.analysis);
      } else {
        alert('Error analyzing syllabus: ' + result.error);
      }
    } catch (error) {
      alert('Something went wrong during analysis!');
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
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
            onClick={handleUpload}
            disabled={!file || isLoading}
            className={`px-6 py-2 rounded font-medium ${
              !file || isLoading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Processing...' : 'Extract Text'}
          </button>

          {text && (
            <button
              onClick={analyzeDatesWithClaude}
              disabled={isAnalyzing}
              className={`px-6 py-2 rounded font-medium ${
                isAnalyzing
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Syllabus'}
            </button>
          )}
        </div>
      </div>

      {text && (
        <div className="bg-white border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Extracted Text
          </h2>
          <div className="bg-gray-50 border rounded p-4 max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm text-gray-700">
              {text}
            </pre>
          </div>
        </div>
      )}

      {claudeAnalysis && (
        <div className="bg-white border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Analysis Results
          </h2>

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

          <div className="space-y-3">
            {claudeAnalysis.events.map((event, index) => (
              <div key={index} className="border rounded p-4 bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        event.type === 'exam'
                          ? 'bg-red-100 text-red-800'
                          : event.type === 'assignment'
                          ? 'bg-blue-100 text-blue-800'
                          : event.type === 'quiz'
                          ? 'bg-yellow-100 text-yellow-800'
                          : event.type === 'project'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {event.type.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-600">{event.date}</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-1">
                    {event.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {event.description}
                  </p>
                  {event.week && (
                    <p className="text-sm text-blue-600">Week: {event.week}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">How it works:</h3>
        <ol className="text-sm text-blue-700 space-y-1">
          <li>1. Choose a PDF file (your course syllabus)</li>
          <li>2. Click Extract Text to pull out all the text</li>
          <li>
            3. Click Analyze Syllabus to extract important information with AI
          </li>
          <li>4. View the structured data and course information!</li>
        </ol>
      </div>
    </div>
  );
}
