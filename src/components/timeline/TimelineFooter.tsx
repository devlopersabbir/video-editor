import { Play, Pause, Plus, X, ZoomIn, ZoomOut } from 'lucide-react';
import { useStore } from '../../store/store';
import { formatTime } from '../../utils/time-utils';
import { usePlayback } from '../../hooks/usePlayback';
import { useState, useRef } from 'react';

export function TimelineFooter() {
  const { timeline, togglePlayback, setPlayheadPosition, setCurrentPage, elements, addPage, removePage, assets } = useStore();
  const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false);
  const [timelineZoom, setTimelineZoom] = useState(100);
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
    const x = Math.max(0, Math.min(e.clientX - rect.left - 100, rect.width - 100));
    const time = (x / (rect.width - 100)) * timeline.duration;
    setPlayheadPosition(Math.max(0, Math.min(timeline.duration, time)));
  };

  const handleTimelineMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains('timeline-ruler') || 
        (e.target as HTMLElement).classList.contains('timeline-track-area')) {
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
      color: '#2D9CDB',
      duration: 10,
    };
    addPage(newPage);
  };

  const handleAddLayout = () => {
    const newLayout = {
      id: `layout-${Date.now()}`,
      name: `Layout ${timeline.pages.filter(p => p.name.startsWith('Layout')).length + 1}`,
      color: '#F2994A',
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

  // Generate time markers for ruler
  const timeMarkers = [];
  const markerInterval = 2; // 2 seconds
  for (let i = 0; i <= timeline.duration; i += markerInterval) {
    timeMarkers.push(i);
  }

  const getClipThumbnail = (element: any) => {
    if (element.type === 'image' || element.type === 'video') {
      const asset = assets.find(a => a.id === element.assetId);
      return asset?.thumbnail || asset?.url;
    }
    return null;
  };

  return (
    <div className="timeline-footer">
      {/* Top Bar - Playback Controls and Page/Layout Tabs */}
      <div className="timeline-header">
        <div className="playback-controls">
          <button 
            className={`play-button ${timeline.isPlaying ? 'playing' : ''}`}
            onClick={togglePlayback}
          >
            {timeline.isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <span className="time-display">
            {formatTime(timeline.playheadPosition)} / {formatTime(timeline.duration)}
          </span>
        </div>

        <div className="page-layout-tabs">
          {timeline.pages.map((page) => {
            const isPage = page.name.startsWith('Page');
            const isActive = timeline.currentPageId === page.id;
            
            return (
              <div
                key={page.id}
                className={`tab ${isPage ? 'page-tab' : 'layout-tab'} ${isActive ? 'active' : ''}`}
                onClick={() => setCurrentPage(page.id)}
              >
                <span className="tab-label">{page.name}</span>
                {timeline.pages.length > 1 && (
                  <button
                    className="tab-close"
                    onClick={(e) => handleRemovePage(page.id, e)}
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            );
          })}
          <button className="add-page-btn" onClick={handleAddPage}>
            <Plus size={14} />
            <span>Page</span>
          </button>
          <button className="add-layout-btn" onClick={handleAddLayout}>
            <Plus size={14} />
            <span>Layout</span>
          </button>
        </div>
      </div>

      {/* Timeline Tracks */}
      <div 
        ref={timelineRef}
        className="timeline-content"
        onMouseDown={handleTimelineMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {timeline.layers.map((layer) => (
          <div key={layer.id} className="timeline-track">
            <div className="track-label">
              <span className="track-name">{layer.name}</span>
            </div>

            <div className="timeline-track-area">
              {/* Render clips */}
              {currentPageElements
                .filter((el) => el.layerId === layer.id)
                .map((el) => {
                  const left = (el.startTime / timeline.duration) * 100;
                  const width = ((el.endTime - el.startTime) / timeline.duration) * 100;
                  const thumbnail = getClipThumbnail(el);
                  
                  return (
                    <div
                      key={el.id}
                      className="timeline-clip"
                      style={{
                        left: `${left}%`,
                        width: `${width}%`,
                      }}
                    >
                      {thumbnail && (
                        <div 
                          className="clip-thumbnail"
                          style={{ backgroundImage: `url(${thumbnail})` }}
                        />
                      )}
                      <span className="clip-name">{el.name}</span>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}

        {/* Timeline Ruler */}
        <div className="timeline-ruler-track">
          <div className="track-label"></div>
          <div className="timeline-ruler">
            {timeMarkers.map((time) => (
              <div
                key={time}
                className="time-marker"
                style={{ left: `${(time / timeline.duration) * 100}%` }}
              >
                <div className="marker-line"></div>
                <span className="marker-label">{time}s</span>
              </div>
            ))}
          </div>
        </div>

        {/* Playhead */}
        <div
          className="playhead"
          style={{
            left: `calc(100px + ${(timeline.playheadPosition / timeline.duration) * 100}% * (100% - 100px) / 100%)`,
          }}
        >
          <div
            className="playhead-handle"
            onMouseDown={handlePlayheadMouseDown}
          />
          <div className="playhead-line" />
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="timeline-zoom-controls">
        <button 
          className="zoom-btn"
          onClick={() => setTimelineZoom(Math.max(50, timelineZoom - 10))}
        >
          <ZoomOut size={16} />
        </button>
        <span className="zoom-level">{timelineZoom}%</span>
        <button 
          className="zoom-btn"
          onClick={() => setTimelineZoom(Math.min(200, timelineZoom + 10))}
        >
          <ZoomIn size={16} />
        </button>
      </div>
    </div>
  );
}
