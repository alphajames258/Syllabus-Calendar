// app/page.tsx
import PDFUpload from '../components/pdfupload';

export default function Home() {
  return (
    <main className="min-h-screen bg-black py-8">
      <PDFUpload />
    </main>
  );
}
