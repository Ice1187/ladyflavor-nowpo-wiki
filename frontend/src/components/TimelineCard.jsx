function TimelineCard({ time, topic }) {
  return (
    <div className="p-3 bg-white rounded-md shadow hover:shadow-md transition-shadow border-l-4 border-primary-dark">
      <div className="font-mono text-sm text-secondary-dark mb-1">{time}</div>
      <div>{topic}</div>
    </div>
  );
}

export default TimelineCard;
