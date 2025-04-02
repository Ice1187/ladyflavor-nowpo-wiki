function Sidebar({ episodes, isOpen, onToggle, selectedEpisodeId, onSelectEpisode }) {
  return (
    <div className={`${isOpen ? 'w-64' : 'w-16'} transition-width duration-300 ease-in-out m-4 overflow-y-auto bg-white shadow-md rounded`}>
      {/* Toggle Button */}
      <div className="p-4 border-b">
        <button 
          onClick={onToggle}
          className="p-2 rounded-md hover:bg-gray-200"
        >
          {isOpen ? '◀' : '▶'}
        </button>
      </div>

      {/* Episode List */}
      <div className="overflow-y-auto h-full">
        {episodes.map(episode => (
          <div 
            key={episode.id}
            onClick={() => onSelectEpisode(episode.id)}
            className={`p-4 cursor-pointer hover:bg-gray-100 ${selectedEpisodeId === episode.id ? 'bg-gray-200 font-bold' : ''}`}
          >
            {isOpen ? (
              <div>
                <div>{episode.episode} - {episode.title.length > 10 ? `${episode.title.substring(0, 10)}...` : episode.title}</div>
                <div className="text-sm text-gray-500">{episode.date}</div>
              </div>
            ) : (
              <div className="text-center">EP{episode.id}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
