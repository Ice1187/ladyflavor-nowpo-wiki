import { useState, useEffect } from 'react';
import TimelineCard from './TimelineCard';

function EpisodePanel({ episode }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
  }, [episode?.embed_url]);

  if (!episode) return <div className="flex-1 p-6 bg-white">Select an episode</div>;

  return (
    <div className="flex-1 p-6 bg-white shadow-md m-4 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">EP{episode.episode} - {episode.title}</h1>
      {/* <div className="text-gray-600 mb-2">Date: {episode.date}</div> */}
      {/* Add more episode metadata here */}
      <div className={`transition-all duration-500 ${isLoaded ? '' : 'opacity-50 blur-sm'}`}>
        <iframe
          src={episode.embed_url}
          className="rounded-xl w-full"
          height="152"
          frameBorder="0"
          allowFullScreen=""
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
        ></iframe>
      </div>
    </div>
  );
}

export default EpisodePanel;
