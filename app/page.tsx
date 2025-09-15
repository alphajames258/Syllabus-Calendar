'use client';

import { useState, useEffect } from 'react';
import { Plus, BookOpen, Eye, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ClaudeAnalysis, ViewMode } from '../components/types';
import SyllabusModal from '../components/SyllabusModal';

const Dashboard = () => {
  const [syllabises, setSyllabises] = useState<ClaudeAnalysis[]>([]);
  const [selectedSyllabus, setSelectedSyllabus] =
    useState<ClaudeAnalysis | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const router = useRouter();

  // Load saved syllabi from localStorage on component mount
  useEffect(() => {
    const savedSyllabi = localStorage.getItem('savedSyllabi');
    if (savedSyllabi) {
      try {
        setSyllabises(JSON.parse(savedSyllabi));
      } catch (error) {
        console.error('Error loading saved syllabi:', error);
      }
    }
  }, []);

  const handleAddSyllabus = () => {
    router.push('/upload');
  };

  const handleViewSyllabus = (syllabus: ClaudeAnalysis) => {
    setSelectedSyllabus(syllabus);
  };

  const handleCloseModal = () => {
    setSelectedSyllabus(null);
  };

  const handleDeleteSyllabus = (index: number) => {
    if (
      window.confirm(
        'Are you sure you want to delete this syllabus? This action cannot be undone.'
      )
    ) {
      const updatedSyllabi = syllabises.filter((_, i) => i !== index);
      setSyllabises(updatedSyllabi);
      localStorage.setItem('savedSyllabi', JSON.stringify(updatedSyllabi));
    }
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome to Syllabus Dashboard
          </h1>
          <p className="text-gray-300">
            Add your syllabus so we can create a list and a calendar view of all
            important information
          </p>
        </div>

        <div className="mb-8">
          <button
            onClick={handleAddSyllabus}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Add New Syllabus
          </button>
        </div>

        {/* Main Content */}
        {syllabises.length === 0 ? (
          /* Empty State */
          <div className="bg-gray-900 rounded-lg border border-gray-700 p-12 text-center">
            <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              No courses added yet
            </h3>
            <p className="text-gray-300 mb-6">
              Upload your first syllabus to get started
            </p>
            <button
              onClick={handleAddSyllabus}
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Add your first syllabus
            </button>
          </div>
        ) : (
          /* Syllabi List */
          <div className="space-y-4">
            {syllabises.map((syllabus, index) => (
              <div
                key={index}
                className="bg-gray-900 rounded-lg border border-gray-700 p-6"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {syllabus.courseName}
                    </h3>
                    <p className="text-gray-300">
                      {syllabus.instructor} • {syllabus.semester}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewSyllabus(syllabus)}
                      className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded"
                    >
                      <Eye size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteSyllabus(index)}
                      className="p-2 text-red-400 hover:text-red-200 hover:bg-red-900/20 rounded"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for viewing syllabus details */}
        {selectedSyllabus && (
          <SyllabusModal
            syllabus={selectedSyllabus}
            viewMode={viewMode}
            onClose={handleCloseModal}
            onViewModeChange={setViewMode}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
