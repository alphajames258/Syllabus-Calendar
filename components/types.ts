export interface CalendarEvent {
  date: string;
  title: string;
  type:
    | 'assignment'
    | 'exam'
    | 'quiz'
    | 'project'
    | 'reading'
    | 'class'
    | 'other';
  description: string;
  week?: number;
}

export interface GradeBreakdown {
  category: string;
  percentage: number;
}

export interface ClaudeAnalysis {
  courseName: string;
  instructor: string;
  semester: string;
  gradeBreakdown: GradeBreakdown[];
  events: CalendarEvent[];
  totalEvents: number;
  error: boolean;
}

export type ViewMode = 'list' | 'calendar';
