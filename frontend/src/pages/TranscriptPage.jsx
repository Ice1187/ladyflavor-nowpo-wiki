import React, { useState, useEffect, useMemo } from 'react';

import transcriptData from '../../../data/transripts.json';

// TODO: FlexSearch seems to be a good tool. Lunr.js is not active maintained.

const TranscriptPage = () => {
  const [episodes, setEpisodes] = useState([]);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Load transcript data from JSON file
    // For GitHub Pages, this file should be in your public folder
    setEpisodes(transcriptData.episodes || []);
    setIsLoading(false);

    // Default to first episode if available
    if (transcriptData.episodes && transcriptData.episodes.length > 0) {
      setSelectedEpisode(transcriptData.episodes[0]);
    }
  }, []);

  // Function to handle time click, to be passed to TranscriptItem
  const handleTimeClick = (seconds) => {
    // This would typically control an audio player, which you could implement
    console.log(`Seek to ${seconds} seconds`);
    // Example: if you have an audio player reference
    // audioPlayerRef.current.currentTime = seconds;
  };

  // Filter transcript items based on search query
  const filteredTranscript = useMemo(() => {
    if (!selectedEpisode || !selectedEpisode.transcript) return [];

    if (!searchQuery.trim()) {
      return selectedEpisode.transcript;
    }

    return selectedEpisode.transcript.filter(item => 
      item.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [selectedEpisode, searchQuery]);

  if (isLoading) {
    return <div className="p-4 text-center">Loading transcripts...</div>;
  }

  if (episodes.length === 0) {
    return <div className="p-4 text-center">No transcript data available.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary-dark mb-6">Podcast Transcripts</h1>

      {/* Episode selector */}
      <div className="mb-8">
        <label htmlFor="episode-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select Episode
        </label>
        <select
          id="episode-select"
          value={selectedEpisode?.id || ''}
          onChange={(e) => {
            const episode = episodes.find(ep => ep.id === e.target.value);
            setSelectedEpisode(episode);
            setSearchQuery(''); // Reset search when changing episodes
          }}
          className="w-full p-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-primary-dark"
        >
          {episodes.map(episode => (
            <option key={episode.id} value={episode.id}>
              {episode.title}
            </option>
          ))}
        </select>
      </div>
      
      {/* Search bar */}
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search in transcript..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 pl-10 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-primary-dark"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        {searchQuery && (
          <div className="mt-2 text-sm text-gray-600">
            Found {filteredTranscript.length} results for "{searchQuery}"
          </div>
        )}
      </div>
      
      {/* Episode details */}
      {selectedEpisode && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-primary-dark mb-2">{selectedEpisode.title}</h2>
          {selectedEpisode.date && (
            <p className="text-gray-600 mb-2">{selectedEpisode.date}</p>
          )}
          {selectedEpisode.description && (
            <p className="text-gray-700">{selectedEpisode.description}</p>
          )}
        </div>
      )}
      
      {/* Transcript items */}
      {selectedEpisode && filteredTranscript.length > 0 ? (
        <div className="space-y-4">
          {filteredTranscript.map((item, index) => (
            <TranscriptItem
              key={index}
              time={item.time}
              text={item.text}
              searchTerm={searchQuery}
              onTimeClick={handleTimeClick}
            />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-white rounded-md shadow">
          {searchQuery ? 'No matching transcript segments found.' : 'This episode has no transcript available.'}
        </div>
      )}
    </div>
  );
};

// Custom component for transcript items with highlighted search results
const TranscriptItem = ({ time, text, searchTerm, onTimeClick }) => {
  // Function to convert timecode string to seconds (reused from TimelineCard)
  function timecodeStrToSeconds(timeString) {
    if (!timeString) return 0;
    const [minutes, seconds] = timeString.split(':').map(Number);
    return minutes*60 + seconds;
  }
  
  // Function to highlight search term in text
  const highlightText = (text, term) => {
    if (!term || !term.trim()) {
      return <span>{text}</span>;
    }
    
    const regex = new RegExp(`(${term.trim()})`, 'gi');
    const parts = text.split(regex);
    
    return (
      <span>
        {parts.map((part, i) => 
          regex.test(part) ? 
            <span key={i} className="bg-yellow-200 font-medium">{part}</span> : 
            <span key={i}>{part}</span>
        )}
      </span>
    );
  };
  
  return (
    <div className="p-4 bg-white rounded-md shadow hover:shadow-md transition-shadow border-l-4 border-primary-dark">
      <div
        className="font-mono text-sm text-secondary-dark mb-2 cursor-pointer hover:underline"
        onClick={() => onTimeClick(timecodeStrToSeconds(time))}
      >
        {time}
      </div>
      <div className="text-gray-800">
        {highlightText(text, searchTerm)}
      </div>
    </div>
  );
};

export default TranscriptPage;
