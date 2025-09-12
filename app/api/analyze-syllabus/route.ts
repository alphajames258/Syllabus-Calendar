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
    const prompt = `Help me pull out all the important dates and info from this course syllabus. I need to get everything into my calendar so I don't miss anything.

Return the data as JSON in this format:

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

What I need:

Basic info:
- Course name and instructor
- What semester/year this is for
- How grades are calculated (percentages for exams, homework, etc.)

All the dates:
- Every assignment due date
- All exams and quizzes
- Project deadlines
- Reading assignments
- Regular class meetings if they're listed
- Any other important dates

For dates, handle different formats like "Sept 15", "9/15/2024", "Monday September 15", etc. If you see "Week 3" or similar, try to figure out the actual date.

For event types, use common sense:
- "assignment" for homework, problem sets
- "exam" for tests, midterms, finals  
- "quiz" for short tests, entrance quizzes, exit tickets
- "project" for big assignments, papers
- "reading" for assigned readings
- "class" for lectures, meetings, regular class sessions
- "discussion" for class discussions, group work
- And so on...

Important: If the syllabus describes what happens in every class (like "each class includes a quiz and discussion"), create events for each class date that show these recurring activities.

Make sure to check the whole document - sometimes important dates are buried in random paragraphs or at the bottom.

Here's the syllabus:
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
