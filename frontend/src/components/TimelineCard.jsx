function TimelineCard({ time, topic, onTimeClick }) {

  function timecodeStrToSeconds(timeString) {
    if (!timeString) return 0;
    const [minutes, seconds] = timeString.split(':').map(Number);
    return minutes*60 + seconds;
  }

  return (
    <div className="p-3 bg-white rounded-md shadow hover:shadow-md transition-shadow border-l-4 border-primary-dark">
      <div
        className="font-mono text-sm text-secondary-dark mb-1 cursor-pointer hover:underline"
        onClick={() => onTimeClick(timecodeStrToSeconds(time))}
      >
        {time}
      </div>
      <div>{topic}</div>
    </div>
  );
}

export default TimelineCard;
