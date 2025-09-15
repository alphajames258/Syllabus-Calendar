'use client';

import { X } from 'lucide-react';
import { SyllabusModalProps } from './types';
import CalendarView from './CalendarView';
import EventListView from './EventListView';

const SyllabusModal = ({
  syllabus,
  viewMode,
  onClose,
  onViewModeChange,
}: SyllabusModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {syllabus.courseName}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => onViewModeChange('list')}
                className={`px-4 py-2 rounded text-sm font-medium ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                List View
              </button>
              <button
                onClick={() => onViewModeChange('calendar')}
                className={`px-4 py-2 rounded text-sm font-medium ${
                  viewMode === 'calendar'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Calendar View
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Course Information */}
          <div className="mb-6 p-4 bg-blue-50 rounded">
            <h3 className="font-semibold text-blue-800 mb-2">
              Course Information
            </h3>
            <p className="text-black">
              <strong>Course:</strong> {syllabus.courseName}
            </p>
            <p className="text-black">
              <strong>Instructor:</strong> {syllabus.instructor}
            </p>
            <p className="text-black">
              <strong>Semester:</strong> {syllabus.semester}
            </p>
            <p className="text-black">
              <strong>Total Events:</strong> {syllabus.totalEvents}
            </p>
          </div>

          {/* Grade Breakdown */}
          {syllabus.gradeBreakdown && syllabus.gradeBreakdown.length > 0 && (
            <div className="mb-6 p-4 bg-green-50 rounded">
              <h3 className="font-semibold text-green-800 mb-2">
                Grading Breakdown
              </h3>
              <div className="space-y-1">
                {syllabus.gradeBreakdown.map((grade, index) => (
                  <p key={index} className="text-black">
                    <strong>{grade.category}:</strong> {grade.percentage}%
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Events View */}
          {viewMode === 'calendar' ? (
            <CalendarView events={syllabus.events} />
          ) : (
            <EventListView events={syllabus.events} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SyllabusModal;
