'use client';

import { useState } from 'react';

export default function PDFUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setText('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a PDF file first!');
      return;
    }

    setIsLoading(true);
    setText('');

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

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-white mb-8">PDF Text Extractor</h1>

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
      </div>

      {text && (
        <div className="bg-white border rounded-lg p-6">
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

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">How it works:</h3>
        <ol className="text-sm text-blue-700 space-y-1">
          <li>1. Choose a PDF file (like your course syllabus)</li>
          <li>2. Click Extract Text - we will pull out all the text</li>
          <li>3. Review the extracted text below</li>
          <li>
            4. Next: AI will turn dates and assignments into calendar events!
          </li>
        </ol>
      </div>
    </div>
  );
}
