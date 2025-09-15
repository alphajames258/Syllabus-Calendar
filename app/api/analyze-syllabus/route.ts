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
    const prompt = `You are a syllabus analysis expert. Your job is to extract important information from a course syllabus 

VALIDATION FIRST:
    Before processing, verify this is actually a course syllabus by checking for:
    - Course name/number
    - Instructor information
    - Academic dates/schedule
    - Grading information
    - Learning objectives or course content
    If this isn't a course syllabus, return: {"error": true, "message": (give exact reason why it is not a syllabus)}

Return the data as JSON in this format:

{
  "error": false,
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
 
}

BASIC INFO:
Course name and instructor name only
Semester/year

GRADING (keep it simple):
Just the main categories and percentages
Skip detailed policies

EVENTS:
All assignment due dates
All exam dates (midterm, final, etc.)
Project deadlines
No-class days and holidays
Regular class meetings (if specific dates given)
Any other date with a deadline
Reading assignments

DATE RULES:
- Convert everything to YYYY-MM-DD format
- Handle "Sept 15", "9/15", "Week 3", etc.
- If you can't figure out exact date, skip it


WEEKLY READING SCHEDULES:
If you see "Week 1", "Week 2" patterns with M: W: T: Th: assignments:
1. Find class meeting days from syllabus (MW, TTh, etc.)
2. Assume Week 1 starts on semester start date or typical fall/spring start
3. Map Week X + Day to actual calendar date
4. Create "Reading: [exact content]" events with type "assignment"
5. Skip weeks marked "Holiday" or "no readings"

Example: If class meets MW and Week 1 M has reading → first Monday of semester
Week 3 M: Labor Day Holiday → create "no_class" event instead of reading

RECURRING ACTIVITIES: 
Look for phrases like:
- "Each class will include..."
- "Every [day] we will..."  
- "Weekly assignments due..."
- "Quiz every Tuesday"
- "Homework due each Friday"

When you find these:
1. Calculate ALL class meeting dates for the semester
2. Create individual events for EACH occurrence
3. Use the meeting days/times from the syllabus
4. Account for no-class days and holidays
5. Don't just say "weekly quiz" - give me actual dates: Sept 3, Sept 10, Sept 17, etc.

EXAMPLE: If class meets T/Th and "each class includes entrance quiz":
- Create "Entrance Quiz" event for every Tuesday and Thursday
- Skip dates that are marked as no-class days

FOCUS ON: What goes on a calendar and when assignments are due.
Make sure to check the whole document - sometimes important dates are buried in random paragraphs or at the bottom.

Here's the syllabus:
${syllabusText}`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 10000,
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
