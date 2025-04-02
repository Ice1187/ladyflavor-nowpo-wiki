import TimelineCard from './TimelineCard';

function TimelinePanel({ timecodes }) {
  return (
    <div className="flex-1 md:flex-2 p-4 overflow-y-auto bg-gray-50 m-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Timeline</h2>

      <div className="space-y-3">
        {timecodes.map((item, index) => (
          <TimelineCard
            key={index}
            time={item.time}
            topic={item.topic}
          />
        ))}
      </div>
    </div>
  );
}

export default TimelinePanel;
