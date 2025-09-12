import { useState } from 'react';
import { CalendarEvent } from './types';

interface CalendarViewProps {
  events: CalendarEvent[];
}

const CalendarView = ({ events }: CalendarViewProps) => {
  let earliestDate = new Date();

  if (events.length > 0) {
    const validEvents = events.filter((event) => event.date !== null);

    if (validEvents.length > 0) {
      earliestDate = new Date(validEvents[0].date);

      for (let i = 1; i < validEvents.length; i++) {
        const eventDate = new Date(validEvents[i].date);
        if (eventDate < earliestDate) {
          earliestDate = eventDate;
        }
      }
    }
  }

  const [currentMonth, setCurrentMonth] = useState(
    new Date(earliestDate.getFullYear(), earliestDate.getMonth(), 1)
  );

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const eventsByDate: { [key: string]: CalendarEvent[] } = {};

  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const dateKey = event.date;

    if (!eventsByDate[dateKey]) {
      eventsByDate[dateKey] = [];
    }

    eventsByDate[dateKey].push(event);
  }

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);

    const lastDay = new Date(year, month + 1, 0);

    const firstDayOfWeek = firstDay.getDay();

    const days = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  const goToPreviousMonth = () => {
    const newMonth = new Date(currentMonth);
    // Go back one month
    newMonth.setMonth(newMonth.getMonth() - 1);
    // Update the calendar to show the new month
    setCurrentMonth(newMonth);
  };

  const goToNextMonth = () => {
    // Create a copy of current month
    const newMonth = new Date(currentMonth);
    // Go forward one month
    newMonth.setMonth(newMonth.getMonth() + 1);
    // Update the calendar to show the new month
    setCurrentMonth(newMonth);
  };

  const formatDateKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  if (!events.length) {
    return (
      <div className="bg-gray-50 border rounded p-8 text-center">
        <p className="text-gray-600">No events to display in calendar view.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex justify-between items-center mb-4 bg-blue-600 text-white p-4 rounded-lg">
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-blue-700 rounded-full transition-colors"
          aria-label="Previous month"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <h3 className="text-xl font-bold">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>

        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-blue-700 rounded-full transition-colors"
          aria-label="Next month"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="p-2 text-center font-semibold text-gray-600 text-sm"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => {
          if (!date) {
            return <div key={index} className="p-2 h-24"></div>;
          }

          const dateKey = formatDateKey(date);
          const dayEvents = eventsByDate[dateKey] || [];
          const isToday = date.toDateString() === new Date().toDateString();

          return (
            <div
              key={dateKey}
              className={`p-1 h-24 border border-gray-200 ${
                isToday ? 'bg-blue-50 border-blue-300' : 'bg-white'
              }`}
            >
              <div
                className={`text-sm font-medium mb-1 ${
                  isToday ? 'text-blue-600' : 'text-gray-700'
                }`}
              >
                {date.getDate()}
              </div>

              <div className="space-y-1">
                {dayEvents.map((event, eventIndex) => (
                  <div
                    key={eventIndex}
                    className="text-xs p-1 rounded bg-gray-100 text-gray-800"
                  >
                    <div className="font-medium truncate">{event.title}</div>
                    <div className="text-gray-600 truncate">
                      {event.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
