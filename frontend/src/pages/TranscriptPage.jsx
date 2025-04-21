import { useState, useEffect, useRef } from 'react';
import { Document } from 'flexsearch';
import Sidebar from '../components/Sidebar';
import { episodes } from '../../../data/episodes';

function TranscriptPage() {
  const [selectedEpisodeId, setSelectedEpisodeId] = useState(null);
  const [transcript, setTranscript] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchingAll, setIsSearchingAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTimecode, setCurrentTimecode] = useState(null);
  const [isSpotifyLoaded, setIsSpotifyLoaded] = useState(false);

  // Create search index with more explicit Chinese config
  const searchIndex = useRef(new Document({
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
    encoder: str => {
      return str.toLowerCase();  // Make Chinese-English mixed sentence work for searching
    },
  }));

  const selectedEpisode = episodes.find(ep => ep.id === selectedEpisodeId);

  // Get base URL from Vite configuration
  const baseUrl = import.meta.env.BASE_URL || '/';

  // Toggle sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);



  // Effect to load transcript when episode changes
  useEffect(() => {
    if (!selectedEpisodeId) return;

    const loadTranscript = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const episode = episodes.find(ep => ep.id === selectedEpisodeId);
        if (!episode) throw new Error('Episode not found');

        const fileName = `EP${episode.episode} ${episode.title}.vtt`;
        const response = await fetch(`${baseUrl}src/vtt/${fileName}`);

        if (!response.ok) {
          throw new Error(`Failed to load transcript: ${response.statusText}`);
        }

        const vttText = await response.text();
        const parsedTranscript = parseVTT(vttText, selectedEpisodeId, episode.episode, episode.title);

        setTranscript(parsedTranscript);

        let indexedCount = 0;
        let lastText = '';

        // Add to search index
        parsedTranscript.forEach((entry, index) => {
          const id = `${selectedEpisodeId}-${index}`;
          searchIndex.current.add({
            id: id,
            text: entry.text,
            start: entry.start,
            episodeId: selectedEpisodeId,
            episode: episode.episode,
            title: episode.title
          });
          indexedCount++;
          lastText = entry.text;
        });

        console.log(`Indexed ${indexedCount} entries for episode ${episode.episode}`);
        console.log('Sample entry text:', lastText);

      } catch (err) {
        console.error('Error loading transcript:', err);
        setError('Unable to load transcript. The file may not exist or there was a network error.');
        setTranscript([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadTranscript();
  }, [selectedEpisodeId, baseUrl]);

  // Parse VTT file content
  const parseVTT = (vttText, episodeId, episodeNumber, episodeTitle) => {
    const lines = vttText.split('\n');
    const entries = [];
    let currentEntry = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line === 'WEBVTT' || line === '') continue;

      if (line.includes('-->')) {
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
        currentEntry.text += line;
        entries.push({ ...currentEntry });
        currentEntry = null;
      }
    }

    return entries;
  };

  // Convert timestamp (00:00.000) to seconds
  const convertTimeToSeconds = (timeString) => {
    const [minutes, secondsMs] = timeString.split(':');
    const [seconds, ms] = secondsMs.split('.');
    return parseInt(minutes) * 60 + parseInt(seconds) + (parseInt(ms || 0) / 1000);
  };

  // Format seconds to MM:SS display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    // Log the search query for debugging
    console.log('Searching for:', searchQuery);

    // Simulate what FlexSearch might tokenize for Chinese
    const simpleTokens = searchQuery.split('').filter(char => char.trim());

    let results;
    let rawResults;

    try {
      // Searching all episodes
      rawResults = searchIndex.current.search(searchQuery, {
        enrich: true,
        limit: 50
      });
      if (!isSearchingAll && selectedEpisodeId) {
        // If we're not searching all episodes and have a selected episode, filter the results
        console.log('Filtering to only current episode:', selectedEpisodeId);
        rawResults = rawResults.map(category => ({
          field: category.field,
          result: category.result.filter(item =>
            item.doc && item.doc.episodeId === selectedEpisodeId
          )
        })).filter(category => category.result.length > 0);
      }

      console.log('selected Episode Id', selectedEpisodeId);
      console.log('Raw search results:', rawResults);

      if (rawResults && rawResults.length > 0) {
        // Process the results correctly
        results = [];

        rawResults.forEach(resultGroup => {
          console.log('Result group:', resultGroup);
          if (resultGroup.result && Array.isArray(resultGroup.result)) {
            resultGroup.result.forEach(item => {
              // Make sure we have all the required fields
              if (item && typeof item === 'object') {
                results.push(item.doc);
                console.log('Added result item:', item.doc);
              }
            });
          }
        });

        console.log('Final processed results:', results.length, results);
        setSearchResults(results);
      } else {
        console.log('No results found');
        setSearchResults([]);
      }
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
    }
  };

  // Jump to timestamp in Spotify player
  const jumpToTimestamp = (seconds) => {
    setCurrentTimecode(seconds);
  };

  const getEmbedUrl = () => {
    if (!selectedEpisode) return '';

    if (currentTimecode) {
      return `${selectedEpisode.embed_url}?utm_source=generator&t=${Math.floor(currentTimecode)}`;
    }

    return `${selectedEpisode.embed_url}?utm_source=generator`;
  };

  return (
    <div className="flex h-full min-h-screen bg-primary-light">
      {/* Sidebar */}
      <Sidebar
        episodes={episodes}
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        selectedEpisodeId={selectedEpisodeId}
        onSelectEpisode={(id) => {
          setSelectedEpisodeId(id);
          setCurrentTimecode(null);
          setSearchResults([]);
        }}
      />

      {/* Main Content */}
      <div className="flex-1 p-4">
        {/* Search bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-3">
            <input
              type="text"
              className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Search in transcripts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              className="bg-secondary hover:bg-secondary-dark text-white px-4 py-2 rounded-md transition-colors"
              onClick={handleSearch}
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
                onChange={() => setIsSearchingAll(!isSearchingAll)}
              />
              Search across all episodes
            </label>
          </div>
        </div>

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
                  <iframe
                    src={getEmbedUrl()}
                    className="rounded-xl w-full"
                    height="152"
                    frameBorder="0"
                    allowFullScreen=""
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    onLoad={() => setIsSpotifyLoaded(true)}
                  ></iframe>
                </div>

                {/* Transcript */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2 text-secondary-dark">
                    Transcript
                  </h3>

                  {isLoading ? (
                    <div className="text-center py-10">
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-secondary border-r-transparent align-[-0.125em]" role="status">
                        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                          Loading...
                        </span>
                      </div>
                      <p className="mt-2 text-secondary">Loading transcript...</p>
                    </div>
                  ) : error ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                      {error}
                    </div>
                  ) : (
                    <div className="max-h-[60vh] overflow-y-auto">
                      {transcript.map((entry, index) => (
                        <div
                          key={index}
                          className="mb-4 p-2 hover:bg-gray-100 rounded cursor-pointer transition-colors"
                          onClick={() => jumpToTimestamp(entry.start)}
                        >
                          <div className="text-primary-dark font-mono mb-1">
                            {formatTime(entry.start)}
                          </div>
                          <div className="text-gray-700">
                            {/* Fix: Add null check for entry.text and searchQuery */}
                            {searchQuery && entry.text && entry.text.includes(searchQuery) ? (
                              <mark className="bg-yellow-200">{entry.text}</mark>
                            ) : (
                              entry.text
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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

              {searchResults.length === 0 ? (
                searchQuery ? (
                  <p className="text-center py-4 text-secondary">No results found for "{searchQuery}".</p>
                ) : (
                  <p className="text-center py-4 text-secondary">
                    Enter a search term to find in the transcripts.
                  </p>
                )
              ) : (
                <div className="max-h-[70vh] overflow-y-auto">
                  {searchResults.map((result, index) => {
                    // Debug what we're getting in each result
                    console.log(`Rendering result ${index}:`, result);

                    return (
                      <div
                        key={index}
                        className="mb-4 p-3 border-b hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          // If result is from a different episode, load that episode first
                          if (result.episodeId !== selectedEpisodeId) {
                            setSelectedEpisodeId(result.episodeId);
                          }

                          // Jump to the timestamp
                          setTimeout(() => jumpToTimestamp(result.start), 100);
                        }}
                      >
                        <div className="flex justify-between mb-1">
                          <span className="text-primary-dark font-mono">
                            {/* Handle start time correctly */}
                            {typeof result.start === 'number'
                              ? formatTime(result.start)
                              : 'Unknown time'}
                          </span>
                          <span className="text-sm text-secondary">
                            {/* Handle episode number correctly */}
                            EP{result.episode || '?'}
                          </span>
                        </div>
                        <div className="text-gray-700">
                          {/* Highlight search term in the result text */}
                          {searchQuery && result.text && result.text.includes(searchQuery) ? (
                            <span dangerouslySetInnerHTML={{
                              __html: result.text.replace(
                                new RegExp(`(${searchQuery})`, 'gi'),
                                '<mark class="bg-yellow-200">$1</mark>'
                              )
                            }} />
                          ) : (
                            result.text || ""
                          )}
                        </div>
                        {result.episodeId !== selectedEpisodeId && (
                          <div className="mt-1 text-xs text-gray-500 italic">
                            {result.title || ""}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TranscriptPage;