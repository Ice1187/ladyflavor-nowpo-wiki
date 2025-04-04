import { useState, useEffect } from 'react';
import TimelineCard from './TimelineCard';

function EpisodePanel({ episode, timecode }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
  }, [episode?.embed_url, timecode]);

  if (!episode) return <div className="flex-1 p-6 bg-white">Select an episode</div>;

  const embedUrl = `${episode.embed_url}?utm_source=generator&t=${timecode}`;

  return (
    <div className="flex-1 p-6 bg-white shadow-md m-4 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">EP{episode.episode} - {episode.title}</h1>
      {/* Add more episode metadata here */}
      <div className={`transition-all duration-500 ${isLoaded ? '' : 'opacity-50 blur-sm'}`}>
        <iframe
          src={embedUrl}
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
