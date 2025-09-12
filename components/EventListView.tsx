import { CalendarEvent } from './types';

interface EventListViewProps {
  events: CalendarEvent[];
}

const EventListView = ({ events }: EventListViewProps) => {
  return (
    <div className="space-y-3">
      {events.map((event, index) => (
        <div key={index} className="border rounded p-4 bg-gray-50">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                {event.type.toUpperCase()}
              </span>
              <span className="text-sm text-gray-600">{event.date}</span>
            </div>
            <h4 className="font-semibold text-gray-800 mb-1">{event.title}</h4>
            <p className="text-sm text-gray-600 mb-2">{event.description}</p>
            {event.week && (
              <p className="text-sm text-blue-600">Week: {event.week}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventListView;
