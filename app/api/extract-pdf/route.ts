import { NextRequest, NextResponse } from 'next/server';
import pdf from 'pdf-parse';
import fs from 'fs';
import path from 'path';

// API endpoint to extract text from uploaded PDF files
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('pdf') as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' });
    }

    // Convert file to buffer format that pdf-parse can read
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create test file that pdf-parse library expects (workaround for Next.js compatibility)
    const testFilePath = path.join(
      process.cwd(),
      'test',
      'data',
      '05-versions-space.pdf'
    );
    const testDir = path.dirname(testFilePath);

    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }

    fs.writeFileSync(testFilePath, buffer);

    // Extract text from PDF
    const data = await pdf(buffer);

    return NextResponse.json({
      success: true,
      text: data.text,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to process PDF',
    });
  }
}
