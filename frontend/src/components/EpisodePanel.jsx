import TimelineCard from './TimelineCard';

function EpisodePanel({ episode, timecodes }) {
  if (!episode) return <div className="flex-1 p-6 bg-white">Select an episode</div>;
  
  return (
    <div className="flex-1 p-6 bg-white shadow-md m-4 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">{episode.episode}</h1>
      <div className="text-gray-600 mb-2">Date: {episode.date}</div>
      {/* Add more episode metadata here */}
    </div>
  );
}

export default EpisodePanel;
