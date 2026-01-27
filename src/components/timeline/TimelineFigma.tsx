import { Play, Pause, Home, Plus, X } from 'lucide-react';
import { useStore } from '../../store/store';
import { formatTime } from '../../utils/time-utils';
import { usePlayback } from '../../hooks/usePlayback';
import { useState, useRef } from 'react';
import './TimelineFigma.css';

export function TimelineFigma() {
  const { timeline, togglePlayback, setPlayheadPosition, setCurrentPage, elements, addPage, removePage, assets } = useStore();
  const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Use playback hook
  usePlayback();

  const handlePlayheadMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDraggingPlayhead(true);
    updatePlayheadFromMouse(e);
  };

  const updatePlayheadFromMouse = (e: React.MouseEvent) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left - 60, rect.width - 60));
    const time = (x / (rect.width - 60)) * timeline.duration;
    setPlayheadPosition(Math.max(0, Math.min(timeline.duration, time)));
  };

  const handleTimelineMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains('timeline-ruler-area') || 
        (e.target as HTMLElement).classList.contains('track-content-area')) {
      setIsDraggingPlayhead(true);
      updatePlayheadFromMouse(e);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingPlayhead) {
      updatePlayheadFromMouse(e);
    }
  };

  const handleMouseUp = () => {
    setIsDraggingPlayhead(false);
  };

  const handleAddPage = () => {
    const newPage = {
      id: `page-${Date.now()}`,
      name: `Page ${timeline.pages.length + 1}`,
      color: '#30A9FF',
      duration: 10,
    };
    addPage(newPage);
  };

  const handleAddLayout = () => {
    const newLayout = {
      id: `layout-${Date.now()}`,
      name: `Layout ${timeline.pages.filter(p => p.name.startsWith('Layout')).length + 1}`,
      color: '#718096',
      duration: 10,
    };
    addPage(newLayout);
  };

  const handleRemovePage = (pageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (timeline.pages.length > 1) {
      removePage(pageId);
    }
  };

  const currentPageElements = elements.filter((el) => el.pageId === timeline.currentPageId);

  // Generate time markers for ruler (every 1 second)
  const timeMarkers = [];
  for (let i = 0; i <= Math.ceil(timeline.duration); i++) {
    timeMarkers.push(i);
  }

  const getClipThumbnail = (element: any) => {
    if (element.type === 'image' || element.type === 'video') {
      const asset = assets.find(a => a.id === element.assetId);
      return asset?.thumbnail || asset?.url;
    }
    return null;
  };

  const playheadPercentage = (timeline.playheadPosition / timeline.duration) * 100;

  return (
    <div className="timeline-figma">
      {/* Playback Controls - Above Timeline */}
      <div className="playback-controls-top">
        <button 
          className={`play-button-large ${timeline.isPlaying ? 'playing' : ''}`}
          onClick={togglePlayback}
        >
          {timeline.isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <span className="time-display-large">
          {formatTime(timeline.playheadPosition)} | {formatTime(timeline.duration)}
        </span>
      </div>

      {/* Tab Navigation */}
      <div className="timeline-tabs">
        <button className="tab-btn home-tab">
          <Home size={16} />
        </button>
        {timeline.pages.map((page) => {
          const isPage = page.name.startsWith('Page');
          const isActive = timeline.currentPageId === page.id;
          
          return (
            <button
              key={page.id}
              className={`tab-btn ${isPage ? 'page-tab' : 'layout-tab'} ${isActive ? 'active' : ''}`}
              onClick={() => setCurrentPage(page.id)}
            >
              <span>{page.name}</span>
              {timeline.pages.length > 1 && (
                <X 
                  size={14} 
                  className="tab-close-icon"
                  onClick={(e) => handleRemovePage(page.id, e)}
                />
              )}
            </button>
          );
        })}
        <button className="tab-btn add-tab" onClick={handleAddPage}>
          <Plus size={14} />
          <span>Page</span>
        </button>
        <button className="tab-btn add-tab" onClick={handleAddLayout}>
          <Plus size={14} />
          <span>Layout</span>
        </button>
      </div>

      {/* Timeline Tracks */}
      <div 
        ref={timelineRef}
        className="timeline-tracks-container"
        onMouseDown={handleTimelineMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Page Track */}
        <div className="timeline-track">
          <div className="track-icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="3" y="4" width="14" height="10" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="10" cy="9" r="2" fill="currentColor"/>
            </svg>
          </div>
          <div className="track-content-area">
            {currentPageElements
              .filter((el) => el.layerId === 'layer-1')
              .map((el) => {
                const left = (el.startTime / timeline.duration) * 100;
                const width = ((el.endTime - el.startTime) / timeline.duration) * 100;
                const thumbnail = getClipThumbnail(el);
                
                return (
                  <div
                    key={el.id}
                    className="timeline-block page-block"
                    style={{
                      left: `${left}%`,
                      width: `${width}%`,
                    }}
                  >
                    {thumbnail && (
                      <div 
                        className="block-thumbnail"
                        style={{ backgroundImage: `url(${thumbnail})` }}
                      />
                    )}
                    <span className="block-label">{el.name || 'page1'}</span>
                    <button className="block-add-btn">
                      <Plus size={12} />
                    </button>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Audio Track */}
        <div className="timeline-track">
          <div className="track-icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M8 6L12 4V14L8 12V6Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <path d="M6 8V10C6 11.1046 5.10457 12 4 12C2.89543 12 2 11.1046 2 10V8C2 6.89543 2.89543 6 4 6C5.10457 6 6 6.89543 6 8Z" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </div>
          <div className="track-content-area">
            {currentPageElements
              .filter((el) => el.type === 'audio' || el.layerId === 'layer-2')
              .map((el) => {
                const left = (el.startTime / timeline.duration) * 100;
                const width = ((el.endTime - el.startTime) / timeline.duration) * 100;
                
                return (
                  <div
                    key={el.id}
                    className="timeline-block audio-block"
                    style={{
                      left: `${left}%`,
                      width: `${width}%`,
                    }}
                  >
                    <span className="block-label">Audio.mp3</span>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Ruler Track */}
        <div className="timeline-ruler-track">
          <div className="track-icon"></div>
          <div className="timeline-ruler-area">
            {timeMarkers.map((time) => (
              <div
                key={time}
                className="time-marker"
                style={{ left: `${(time / timeline.duration) * 100}%` }}
              >
                <div className="marker-tick"></div>
                <span className="marker-time">
                  {String(Math.floor(time / 60)).padStart(2, '0')}:{String(time % 60).padStart(2, '0')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Playhead */}
        <div
          className="playhead-figma"
          style={{ left: `calc(60px + ${playheadPercentage}%)` }}
        >
          <div
            className="playhead-handle-figma"
            onMouseDown={handlePlayheadMouseDown}
          />
          <div className="playhead-line-figma" />
        </div>
      </div>
    </div>
  );
}
