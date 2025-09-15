const Instructions = () => {
  return (
    <div className="mt-8 bg-gradient-to-br from-gray-900 to-black text-white p-8 rounded-xl border border-gray-700 shadow-2xl">
      <h3 className="font-bold mb-6 text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        How it works:
      </h3>

      <ol className="space-y-4">
        <li className="flex items-start gap-3">
          <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
            1
          </span>
          <div>
            <strong className="text-blue-300">Select a PDF:</strong> Choose your
            course syllabus PDF to get started.
          </div>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
            2
          </span>
          <div>
            <strong className="text-purple-300">AI Extraction:</strong> Our AI
            extracts all the important information — course info, assignment
            deadlines, exam dates, and how you will be graded.
          </div>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
            3
          </span>
          <div>
            <strong className="text-green-300">View Your Results:</strong> You
            can see all the information in a list or calendar.
          </div>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
            4
          </span>
          <div>
            <strong className="text-orange-300">Manage:</strong> Save to your
            dashboard or delete.
          </div>
        </li>
      </ol>
    </div>
  );
};

export default Instructions;
