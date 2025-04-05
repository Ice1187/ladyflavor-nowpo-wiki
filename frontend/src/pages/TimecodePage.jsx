import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import EpisodePanel from '../components/EpisodePanel';
import TimelinePanel from '../components/TimelinePanel';
import { episodes } from '../../../data/episodes';
import { timecodes } from '../../../data/timecodes';

function TimecodePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedEpisodeId, setSelectedEpisodeId] = useState(episodes[0].id);
  const [selectedTimecode, setSelectedTimecode] = useState(0);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleTimeClick = (time) => {
    setSelectedTimecode(time);
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <Sidebar
        episodes={episodes}
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        selectedEpisodeId={selectedEpisodeId}
        onSelectEpisode={(id) => {
          setSelectedEpisodeId(id);
          setSelectedTimecode(0);
        }}
      />

      {/* Main Content */}
      <div className="flex flex-col md:flex-row flex-1">
        <EpisodePanel
          episode={episodes.find(ep => ep.id === selectedEpisodeId)}
          timecode={selectedTimecode}
        />
        <TimelinePanel
          timecodes={timecodes[selectedEpisodeId] || []}
          onTimeClick={handleTimeClick}
        />
      </div>
    </div>
  );
}

export default TimecodePage;
