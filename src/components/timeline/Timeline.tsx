import { Play, Pause, Plus, X } from 'lucide-react';
import { useStore } from '../../store/store';
import { formatTime } from '../../utils/time-utils';
import { usePlayback } from '../../hooks/usePlayback';
import { useState, useRef } from 'react';

export function Timeline() {
  const { timeline, togglePlayback, setPlayheadPosition, setCurrentPage, elements, addPage, removePage } = useStore();
  const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Use playback hook
  usePlayback();

  const handlePlayheadMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsDraggingPlayhead(true);
    updatePlayheadFromMouse(e);
  };

  const updatePlayheadFromMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const time = (x / rect.width) * timeline.duration;
    setPlayheadPosition(Math.max(0, Math.min(timeline.duration, time)));
  };

  const handleTimelineMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('timeline-track-content')) {
      setIsDraggingPlayhead(true);
      updatePlayheadFromMouse(e);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDraggingPlayhead) {
      updatePlayheadFromMouse(e);
    }
  };

  const handleMouseUp = () => {
    setIsDraggingPlayhead(false);
  };

  const currentPageElements = elements.filter((el) => el.pageId === timeline.currentPageId);

  const handleAddPage = () => {
    const newPage = {
      id: `page-${Date.now()}`,
      name: `Page ${timeline.pages.length + 1}`,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      duration: 10,
    };
    addPage(newPage);
  };

  const handleRemovePage = (pageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (timeline.pages.length > 1) {
      removePage(pageId);
    }
  };

  return (
    <div className="timeline-area panel">
      <div
        className="flex items-center justify-between"
        style={{ padding: 'var(--spacing-md)', borderBottom: '1px solid var(--color-border)' }}
      >
        <div className="flex items-center gap-md">
          <button 
            className="btn-icon" 
            onClick={togglePlayback}
            style={{
              backgroundColor: timeline.isPlaying ? 'var(--color-accent)' : 'transparent',
              color: timeline.isPlaying ? 'white' : 'var(--color-text-primary)',
            }}
          >
            {timeline.isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <span className="text-sm font-medium" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {formatTime(timeline.playheadPosition)} / {formatTime(timeline.duration)}
          </span>
        </div>

        <div className="flex gap-xs" style={{ overflowX: 'auto', maxWidth: '60%' }}>
          {timeline.pages.map((page) => (
            <div
              key={page.id}
              className={`page-tab ${timeline.currentPageId === page.id ? 'active' : ''}`}
              style={{
                backgroundColor: timeline.currentPageId === page.id ? page.color : 'var(--color-bg-secondary)',
                color: timeline.currentPageId === page.id ? 'white' : 'var(--color-text-primary)',
                padding: 'var(--spacing-xs) var(--spacing-md)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
                transition: 'all 0.2s ease',
                position: 'relative',
              }}
              onClick={() => setCurrentPage(page.id)}
            >
              <span className="text-xs font-medium">{page.name}</span>
              {timeline.pages.length > 1 && (
                <button
                  className="btn-icon"
                  style={{ 
                    width: '16px', 
                    height: '16px', 
                    padding: 0,
                    opacity: 0.7,
                  }}
                  onClick={(e) => handleRemovePage(page.id, e)}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
                >
                  <X size={12} />
                </button>
              )}
            </div>
          ))}
          <button 
            className="btn-secondary text-xs flex items-center gap-xs"
            onClick={handleAddPage}
            style={{ whiteSpace: 'nowrap' }}
          >
            <Plus size={14} /> Layout
          </button>
        </div>
      </div>

      <div 
        ref={timelineRef}
        style={{ flex: 1, overflowY: 'auto', position: 'relative' }}
        onMouseDown={handleTimelineMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {timeline.layers.map((layer) => (
          <div key={layer.id} className="timeline-track">
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '100px',
                padding: 'var(--spacing-sm)',
                backgroundColor: 'var(--color-bg-tertiary)',
                borderRight: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                fontSize: '0.75rem',
                fontWeight: 500,
                zIndex: 2,
              }}
            >
              {layer.name}
            </div>

            <div
              className="timeline-track-content"
              style={{
                marginLeft: '100px',
                position: 'relative',
                height: '100%',
                cursor: isDraggingPlayhead ? 'grabbing' : 'pointer',
              }}
            >
              {/* Render clips */}
              {currentPageElements
                .filter((el) => el.layerId === layer.id)
                .map((el) => {
                  const left = (el.startTime / timeline.duration) * 100;
                  const width = ((el.endTime - el.startTime) / timeline.duration) * 100;
                  
                  return (
                    <div
                      key={el.id}
                      className="timeline-clip"
                      style={{
                        left: `${left}%`,
                        width: `${width}%`,
                        backgroundColor: 'var(--color-page-2)',
                        position: 'absolute',
                        top: '8px',
                        bottom: '8px',
                        borderRadius: 'var(--radius-sm)',
                        padding: 'var(--spacing-xs)',
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'move',
                        transition: 'background-color 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-accent)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-page-2)';
                      }}
                    >
                      <span className="truncate text-xs" style={{ color: 'white' }}>{el.name}</span>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}

        {/* Playhead */}
        <div
          style={{
            position: 'absolute',
            left: `calc(100px + ${(timeline.playheadPosition / timeline.duration) * 100}% * (100% - 100px) / 100%)`,
            top: 0,
            bottom: 0,
            width: '2px',
            backgroundColor: 'var(--color-accent)',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          <div
            onMouseDown={handlePlayheadMouseDown}
            style={{
              position: 'absolute',
              top: '-6px',
              left: '-6px',
              width: '14px',
              height: '14px',
              backgroundColor: 'var(--color-accent)',
              borderRadius: '50%',
              cursor: 'ew-resize',
              pointerEvents: 'all',
              boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
