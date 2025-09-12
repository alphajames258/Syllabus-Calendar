import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY || '', // Make sure you have this in your .env.local file
});

export async function POST(request: NextRequest) {
  try {
    const { syllabusText } = await request.json();

    if (!syllabusText) {
      return NextResponse.json({
        success: false,
        error: 'No syllabus text provided',
      });
    }

    const prompt = `You are a  AI assistant helping students extract ALL important calendar events from their course syllabus. Think like a student who needs to know exactly what's happening each day without reading the full syllabus.

Extract comprehensive course information and return ONLY valid JSON in this exact format:

{
  "courseName": "string",
  "instructor": "string", 
  "semester": "string",
  "gradeBreakdown": [
    {
      "category": "string",
      "percentage": "number"
    }
  ],
  "events": [
    {
      "date": "YYYY-MM-DD",
      "title": "string",
      "type": "assignment|exam|quiz|project|reading|class|discussion|presentation|lab|homework|midterm|final|other",
      "description": "string",
      "week": "number or null"
    }
  ],
  "totalEvents": "number",
  "error": "boolean"
}

CRITICAL EXTRACTION RULES - BE EXTREMELY THOROUGH:

1. COURSE INFO:
   - courseName: Full course title (e.g., "Introduction to Computer Science")
   - instructor: Professor/teacher name
   - semester: Term/year (e.g., "Fall 2024", "Spring 2025")

2. GRADING BREAKDOWN (NO DESCRIPTION FIELD):
   - Extract ALL grade components with percentages
   - Look in sections: "Grading", "Assessment", "Evaluation", "Course Requirements"
   - Examples: "Midterm 30%", "Final Exam 40%", "Homework 20%", "Participation 10%"

3. EVENTS - EXTRACT EVERYTHING WITH A DATE (This is the most important part):
   
   SEARCH THESE SECTIONS THOROUGHLY:
   - Course Schedule, Calendar, Important Dates
   - Assignment Schedule, Due Dates
   - Exam Schedule, Test Dates
   - Project Deadlines, Milestones
   - Reading Assignments, Chapter Due Dates
   - Lab Sessions, Discussion Sections
   - Class Topics, Lecture Schedule
   - Office Hours, Review Sessions
   - Drop/Add Deadlines, Withdrawal Dates
   
   DATE FORMATS TO HANDLE:
   - "September 15", "Sept 15", "9/15", "15 Sep"
   - "Monday, September 15", "Sept 15 (Mon)"
   - "Week 3", "Third Week" (convert to actual dates)
   - Relative dates: "First day of class", "Last day to drop"
   
   EVENT TYPES - Classify carefully:
   - assignment: Homework, problem sets, written work
   - exam: Tests, midterms, finals
   - quiz: Short tests, pop quizzes
   - project: Major projects, papers, presentations
   - reading: Required readings, chapters, articles
   - class: Regular class sessions, lectures
   - discussion: Discussion sections, recitations
   - presentation: Student presentations, demos
   - lab: Laboratory sessions, practical work
   - homework: Regular homework assignments
   - midterm: Midterm exams
   - final: Final exams
   - other: Anything else with a date
   
   DESCRIPTION - Include key details:
   - What exactly is due/happening
   - Specific requirements or topics
   - Format (online, in-person, take-home)
   - Any special instructions

4. COMPREHENSIVE SEARCH STRATEGY:
   - Read the ENTIRE document, not just obvious sections
   - Look for tables, lists, bullet points with dates
   - Check footnotes, appendices, additional pages
   - Find recurring patterns (weekly assignments, regular quizzes)
   - Extract both specific dates AND recurring events
   - Don't skip anything that has a date or deadline

5. DATE INFERENCE:
   - If year missing, infer from semester context
   - Convert relative dates to actual dates when possible
   - Handle academic calendar references
   - Week numbers: convert to actual dates if possible

6. QUALITY CONTROL:
   - Extract EVERYTHING with a date - don't filter or skip
   - If it's important enough to have a date, it's important enough to extract
   - Double-check you haven't missed any sections
   - Be thorough - students need complete information

IMPORTANT: This is for a student's personal calendar. They need to know EVERYTHING that's happening on specific dates. Don't skip anything just because it seems minor.

Syllabus text:
${syllabusText}`;

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText =
      response.content[0].type === 'text' ? response.content[0].text : '';
    console.log('Claude response:', responseText);

    // Try to extract JSON from the response if it contains extra text
    let jsonText = responseText.trim();

    // Look for JSON object in the response
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }

    let analysis;
    try {
      analysis = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Response text:', responseText);
      return NextResponse.json({
        success: false,
        error:
          'Failed to parse Claude response as JSON. Claude may have returned invalid format.',
      });
    }

    return NextResponse.json({
      success: true,
      analysis: analysis,
    });
  } catch (error) {
    console.error('Claude analysis failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to analyze syllabus with Claude AI',
    });
  }
}
