import { useState, useEffect, useRef, useReducer, useMemo, useCallback } from 'react';
import { Document } from 'flexsearch';
import Sidebar from '../components/Sidebar';
import { episodes } from '../../../data/episodes';

// Logger utility - only logs in development
const logger = {
  log: process.env.NODE_ENV === 'development' ? console.log : () => { },
  error: console.error,
  warn: console.warn
};

// Custom hook for transcript search functionality
function useTranscriptSearch() {
  // Create search index with explicit Chinese config
  const index = useRef(new Document({
    document: {
      id: 'id',
      index: ['text'],
      store: ['text', 'start', 'episodeId', 'episode', 'title']
    },
    tokenize: 'forward',
    resolution: 9,
    cache: 100,
    context: true,
    language: 'zh',
    encoder: str => str.toLowerCase()
  }));

  // Add documents to the search index
  const addToIndex = useCallback((documents) => {
    if (!Array.isArray(documents)) return;

    documents.forEach((doc, idx) => {
      const id = `${doc.episodeId}-${idx}`;
      index.current.add({
        id,
        text: doc.text,
        start: doc.start,
        episodeId: doc.episodeId,
        episode: doc.episode,
        title: doc.title
      });
    });

    logger.log(`Indexed ${documents.length} entries for episode ${documents[0]?.episode || 'unknown'}`);
  }, []);

  // Search the index
  const search = useCallback((query, options = {}) => {
    if (!query.trim()) return [];

    try {
      const { episodeId, isSearchingAll = false, limit = 50 } = options;

      const rawResults = index.current.search(query, {
        enrich: true,
        limit
      });

      // Process and filter results
      const results = [];

      rawResults.forEach(resultGroup => {
        if (resultGroup.result && Array.isArray(resultGroup.result)) {
          resultGroup.result.forEach(item => {
            if (item && item.doc) {
              // Only include results from current episode unless searching all
              if (isSearchingAll || item.doc.episodeId === episodeId) {
                results.push(item.doc);
              }
            }
          });
        }
      });

      return results;
    } catch (err) {
      logger.error('Search error:', err);
      return [];
    }
  }, []);

  return { addToIndex, search };
}

// Reducer for state management
function transcriptReducer(state, action) {
  switch (action.type) {
    case 'SET_EPISODE':
      return {
        ...state,
        selectedEpisodeId: action.payload,
        currentTimecode: null,
        searchResults: [],
        error: null
      };
    case 'SET_TRANSCRIPT':
      return { ...state, transcript: action.payload, isLoading: false };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_SEARCH_RESULTS':
      return { ...state, searchResults: action.payload };
    case 'SET_SEARCHING_ALL':
      return { ...state, isSearchingAll: action.payload };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'SET_TIMECODE':
      return { ...state, currentTimecode: action.payload };
    case 'SET_SPOTIFY_LOADED':
      return { ...state, isSpotifyLoaded: action.payload };
    default:
      return state;
  }
}

// Utility functions
const convertTimeToSeconds = (timeString) => {
  const [minutes, secondsMs] = timeString.split(':');
  const [seconds, ms] = secondsMs.split('.');
  return parseInt(minutes) * 60 + parseInt(seconds) + (parseInt(ms || 0) / 1000);
};

const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return '0:00';

  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// VTT parser with improved handling of multi-line captions
const parseVTT = (vttText, episodeId, episodeNumber, episodeTitle) => {
  const lines = vttText.split('\n');
  const entries = [];
  let currentEntry = null;
  let textBuffer = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line === 'WEBVTT' || line === '') continue;

    if (line.includes('-->')) {
      // Save previous entry if exists
      if (currentEntry && textBuffer) {
        currentEntry.text = textBuffer.trim();
        entries.push({ ...currentEntry });
        textBuffer = '';
      }

      const [startTime, endTime] = line.split('-->').map(t => t.trim());
      currentEntry = {
        start: convertTimeToSeconds(startTime),
        end: convertTimeToSeconds(endTime),
        text: '',
        episodeId,
        episode: episodeNumber,
        title: episodeTitle
      };
    } else if (currentEntry && line !== '') {
      // Accumulate text instead of creating new entries
      textBuffer += (textBuffer ? ' ' : '') + line;
    }
  }

  // Add the last entry
  if (currentEntry && textBuffer) {
    currentEntry.text = textBuffer.trim();
    entries.push({ ...currentEntry });
  }

  return entries;
};

// Smaller components
const HighlightedText = ({ text, searchTerm }) => {
  if (!searchTerm || !text || !text.includes(searchTerm)) {
    return <span>{text || ""}</span>;
  }

  return (
    <span dangerouslySetInnerHTML={{
      __html: text.replace(
        new RegExp(`(${searchTerm})`, 'gi'),
        '<mark class="bg-yellow-200">$1</mark>'
      )
    }} />
  );
};

const SearchBar = ({ query, onQueryChange, onSearch, isSearchingAll, onSearchingAllChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4 mb-3">
        <input
          type="text"
          className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Search in transcripts..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        />
        <button
          className="bg-secondary hover:bg-secondary-dark text-white px-4 py-2 rounded-md transition-colors"
          onClick={onSearch}
        >
          Search
        </button>
      </div>

      <div className="flex items-center">
        <label className="flex items-center text-secondary">
          <input
            type="checkbox"
            className="mr-2"
            checked={isSearchingAll}
            onChange={(e) => onSearchingAllChange(e.target.checked)}
          />
          Search across all episodes
        </label>
      </div>
    </div>
  );
};

const SpotifyEmbed = ({ url, onLoad }) => {
  return (
    <iframe
      src={url}
      className="rounded-xl w-full"
      height="152"
      frameBorder="0"
      allowFullScreen=""
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      onLoad={onLoad}
    ></iframe>
  );
};

const TranscriptEntry = ({ entry, searchQuery, onTimestampClick }) => {
  return (
    <div
      className="mb-4 p-2 hover:bg-gray-100 rounded cursor-pointer transition-colors"
      onClick={() => onTimestampClick(entry.start)}
    >
      <div className="text-primary-dark font-mono mb-1">
        {formatTime(entry.start)}
      </div>
      <div className="text-gray-700">
        <HighlightedText text={entry.text} searchTerm={searchQuery} />
      </div>
    </div>
  );
};

const TranscriptView = ({ transcript, isLoading, error, searchQuery, onTimestampClick }) => {
  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-secondary border-r-transparent align-[-0.125em]" role="status">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
        <p className="mt-2 text-secondary">Loading transcript...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="max-h-[60vh] overflow-y-auto">
      {transcript.map((entry, index) => (
        <TranscriptEntry
          key={index}
          entry={entry}
          searchQuery={searchQuery}
          onTimestampClick={onTimestampClick}
        />
      ))}
    </div>
  );
};

const SearchResultItem = ({ result, selectedEpisodeId, onResultClick }) => {
  return (
    <div
      className="mb-4 p-3 border-b hover:bg-gray-50 cursor-pointer"
      onClick={() => onResultClick(result)}
    >
      <div className="flex justify-between mb-1">
        <span className="text-primary-dark font-mono">
          {typeof result.start === 'number' ? formatTime(result.start) : 'Unknown time'}
        </span>
        <span className="text-sm text-secondary">
          EP{result.episode || '?'}
        </span>
      </div>
      <div className="text-gray-700">
        <HighlightedText text={result.text} searchTerm={result.searchQuery} />
      </div>
      {result.episodeId !== selectedEpisodeId && (
        <div className="mt-1 text-xs text-gray-500 italic">
          {result.title || ""}
        </div>
      )}
    </div>
  );
};

const SearchResults = ({ results, searchQuery, selectedEpisodeId, onResultClick }) => {
  if (results.length === 0) {
    return (
      <p className="text-center py-4 text-secondary">
        {searchQuery
          ? `No results found for "${searchQuery}".`
          : "Enter a search term to find in the transcripts."}
      </p>
    );
  }

  return (
    <div className="max-h-[70vh] overflow-y-auto">
      {results.map((result, index) => (
        <SearchResultItem
          key={index}
          result={{ ...result, searchQuery }}
          selectedEpisodeId={selectedEpisodeId}
          onResultClick={onResultClick}
        />
      ))}
    </div>
  );
};

// Main component
function TranscriptPage() {
  // Initialize state with reducer
  const [state, dispatch] = useReducer(transcriptReducer, {
    selectedEpisodeId: null,
    transcript: [],
    searchQuery: '',
    searchResults: [],
    isSearchingAll: false,
    isLoading: false,
    error: null,
    sidebarOpen: false,
    currentTimecode: null,
    isSpotifyLoaded: false
  });

  const {
    selectedEpisodeId,
    transcript,
    searchQuery,
    searchResults,
    isSearchingAll,
    isLoading,
    error,
    sidebarOpen,
    currentTimecode,
    isSpotifyLoaded
  } = state;

  // Get search functionality
  const { addToIndex, search } = useTranscriptSearch();

  // Get base URL from Vite configuration
  const baseUrl = import.meta.env.BASE_URL || '/';

  // Memoize selected episode
  const selectedEpisode = useMemo(() => (
    episodes.find(ep => ep.id === selectedEpisodeId)
  ), [selectedEpisodeId]);

  // Memoize Spotify embed URL
  const embedUrl = useMemo(() => {
    if (!selectedEpisode) return '';

    const baseUrl = `${selectedEpisode.embed_url}?utm_source=generator`;
    return currentTimecode ? `${baseUrl}&t=${Math.floor(currentTimecode)}` : baseUrl;
  }, [selectedEpisode, currentTimecode]);

  // Load transcript when episode changes
  useEffect(() => {
    if (!selectedEpisodeId) return;

    const loadTranscript = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      try {
        const episode = episodes.find(ep => ep.id === selectedEpisodeId);
        if (!episode) throw new Error('Episode not found');

        const fileName = `EP${episode.episode} ${episode.title}.vtt`;
        const response = await fetch(`${baseUrl}src/vtt/${fileName}`);

        if (!response.ok) {
          throw new Error(`Failed to load transcript: ${response.statusText}`);
        }

        // FIXME: EP61 is not loaded, don't know why
        const vttText = await response.text();
        const parsedTranscript = parseVTT(vttText, selectedEpisodeId, episode.episode, episode.title);

        dispatch({ type: 'SET_TRANSCRIPT', payload: parsedTranscript });

        // Add to search index
        addToIndex(parsedTranscript);

      } catch (err) {
        logger.error('Error loading transcript:', err);
        dispatch({
          type: 'SET_ERROR',
          payload: 'Unable to load transcript. The file may not exist or there was a network error.'
        });
      }
    };

    loadTranscript();
  }, [selectedEpisodeId, baseUrl, addToIndex]);

  // Handle search
  const handleSearch = useCallback(() => {
    const results = search(searchQuery, {
      episodeId: selectedEpisodeId,
      isSearchingAll
    });

    dispatch({ type: 'SET_SEARCH_RESULTS', payload: results });
  }, [search, searchQuery, selectedEpisodeId, isSearchingAll]);

  // Handle result click
  const handleResultClick = useCallback((result) => {
    // If result is from a different episode, load that episode first
    if (result.episodeId !== selectedEpisodeId) {
      dispatch({ type: 'SET_EPISODE', payload: result.episodeId });

      // Use setTimeout to wait for episode to load before jumping to timestamp
      setTimeout(() => {
        dispatch({ type: 'SET_TIMECODE', payload: result.start });
      }, 100);
    } else {
      // Jump to timestamp directly
      dispatch({ type: 'SET_TIMECODE', payload: result.start });
    }
  }, [selectedEpisodeId]);

  return (
    <div className="flex h-full min-h-screen bg-primary-light">
      {/* Sidebar */}
      <Sidebar
        episodes={episodes}
        isOpen={sidebarOpen}
        onToggle={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
        selectedEpisodeId={selectedEpisodeId}
        onSelectEpisode={(id) => dispatch({ type: 'SET_EPISODE', payload: id })}
      />

      {/* Main Content */}
      <div className="flex-1 p-4">
        {/* Search bar */}
        <SearchBar
          query={searchQuery}
          onQueryChange={(value) => dispatch({ type: 'SET_SEARCH_QUERY', payload: value })}
          onSearch={handleSearch}
          isSearchingAll={isSearchingAll}
          onSearchingAllChange={(value) => dispatch({ type: 'SET_SEARCHING_ALL', payload: value })}
        />

        {/* Display area - split into two columns on larger screens */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left column: Spotify player + transcript */}
          <div className="lg:w-7/12">
            {selectedEpisode ? (
              <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <h2 className="text-xl font-semibold mb-4 text-secondary-dark">
                  EP{selectedEpisode.episode} - {selectedEpisode.title}
                </h2>

                {/* Spotify embed */}
                <div className={`transition-all duration-500 mb-4 ${isSpotifyLoaded ? '' : 'opacity-50 blur-sm'}`}>
                  <SpotifyEmbed
                    url={embedUrl}
                    onLoad={() => dispatch({ type: 'SET_SPOTIFY_LOADED', payload: true })}
                  />
                </div>

                {/* Transcript */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2 text-secondary-dark">
                    Transcript
                  </h3>

                  <TranscriptView
                    transcript={transcript}
                    isLoading={isLoading}
                    error={error}
                    searchQuery={searchQuery}
                    onTimestampClick={(time) => dispatch({ type: 'SET_TIMECODE', payload: time })}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <p className="text-secondary">Please select an episode to view its transcript.</p>
              </div>
            )}
          </div>

          {/* Right column: Search results */}
          <div className="lg:w-5/12">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-xl font-semibold mb-4 text-secondary-dark">
                Search Results
              </h3>

              <SearchResults
                results={searchResults}
                searchQuery={searchQuery}
                selectedEpisodeId={selectedEpisodeId}
                onResultClick={handleResultClick}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TranscriptPage;