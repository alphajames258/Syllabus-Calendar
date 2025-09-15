'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PDFUpload from '../../components/pdfupload';

export default function UploadPage() {
  const router = useRouter();

  const handleBackToDashboard = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-6xl mx-auto px-8">
        <button
          onClick={handleBackToDashboard}
          className="mb-6 text-white hover:text-gray-300 font-medium py-2 px-0 transition-colors duration-200 flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
        <PDFUpload />
      </div>
    </div>
  );
}
