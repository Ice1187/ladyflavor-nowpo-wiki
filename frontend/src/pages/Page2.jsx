import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import EpisodePanel from '../components/EpisodePanel';
import TimelinePanel from '../components/TimelinePanel';
import { episodes } from '../../../data/episodes';
import { timecodes } from '../../../data/timecodes';

function Page2() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedEpisodeId, setSelectedEpisodeId] = useState(episodes[0].id);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <Sidebar
        episodes={episodes}
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        selectedEpisodeId={selectedEpisodeId}
        onSelectEpisode={setSelectedEpisodeId}
      />

      {/* Main Content */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        <EpisodePanel
          episode={episodes.find(ep => ep.id === selectedEpisodeId)}
        />
        <TimelinePanel
          timecodes={timecodes[selectedEpisodeId] || []}
        />
      </div>
    </div>
  );
}

export default Page2;
