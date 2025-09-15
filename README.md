# 📚 Syllabus Calendar

**Upload your course syllabus PDF → Get an organized calendar of assignments and exams**

This app takes your syllabus PDFs and automatically creates a calendar showing all your important dates, assignments, and exam schedules.

## What it does

1. **Upload** your syllabus PDF
2. **AI analyzes** the document and finds all important dates
3. **View** your schedule in a calendar or list format
4. **Manage** multiple courses in one place

## Quick Start

### 1. Get your Claude API key

- Go to [console.anthropic.com](https://console.anthropic.com/)
- Create an account and get your API key

### 2. Set up the project

```bash
# Clone and install
git clone <your-repo-url>
cd syllabus-calendar
npm install

# Add your API key
echo "CLAUDE_API_KEY=your_key_here" > .env.local

# Start the app
npm run dev
```

### 3. Use the app

- Open [localhost:3000](http://localhost:3000)
- Click "Add New Syllabus"
- Upload your PDF
- View your organized schedule!

## What you'll see

After uploading a syllabus, you'll get:

- **Course info**: Name, instructor, semester
- **Grading breakdown**: What counts for your final grade
- **Important dates**: Assignments, exams, quizzes, projects
- **Two views**: Calendar view and list view

## How it works

**Two-step approach for maximum accuracy:**

1. **PDF Text Extraction**: First, the app extracts all text from your PDF using multiple parsing methods to ensure nothing is missed
2. **Smart AI Analysis**: Then, Claude AI analyzes the extracted text using a carefully crafted prompt that knows exactly what to look for in syllabi

This approach ensures the AI gets clean, complete text to work with, leading to more accurate extraction of your course information.

## Requirements

- Node.js (any recent version)
- Claude API key (free tier available)

## Tech Used

- Next.js & React
- Claude AI for PDF analysis
- Tailwind CSS for styling

---
