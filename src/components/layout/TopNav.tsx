import { useStore } from '../../store/store';
import { Undo2, Redo2, ZoomIn, ZoomOut, Moon, Sun } from 'lucide-react';
import { useState } from 'react';

export function TopNav() {
  const { editor, setProjectName, setTheme, history, undo, redo, canvas, setZoom } = useStore();
  const [showZoomMenu, setShowZoomMenu] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);

  const zoomLevels = [25, 50, 75, 100, 150, 200];

  const handleZoomChange = (level: number) => {
    setZoom(level / 100);
    setShowZoomMenu(false);
  };

  const toggleTheme = () => {
    const newTheme = editor.theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleSave = () => {
    // Save to localStorage
    const state = useStore.getState();
    localStorage.setItem('video-editor-project', JSON.stringify({
      projectName: editor.projectName,
      elements: state.elements,
      assets: state.assets,
      timeline: state.timeline,
    }));
    alert('Project saved!');
  };

  return (
    <div className="top-nav panel flex items-center justify-between" style={{ padding: '0 var(--spacing-md)' }}>
      <div className="flex items-center gap-md">
        <h1 className="text-sm font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
          Editor
        </h1>
        <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--color-border)' }} />
        {isEditingName ? (
          <input
            type="text"
            value={editor.projectName}
            onChange={(e) => setProjectName(e.target.value)}
            onBlur={() => setIsEditingName(false)}
            onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
            autoFocus
            style={{ width: '200px' }}
          />
        ) : (
          <button
            onClick={() => setIsEditingName(true)}
            className="text-sm font-medium"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {editor.projectName}
          </button>
        )}
      </div>

      <div className="flex items-center gap-sm">
        {/* Zoom Controls */}
        <div className="dropdown">
          <button
            className="btn-secondary flex items-center gap-xs"
            onClick={() => setShowZoomMenu(!showZoomMenu)}
          >
            <span className="text-sm">{Math.round(canvas.zoom * 100)}%</span>
          </button>
          {showZoomMenu && (
            <div className="dropdown-menu">
              {zoomLevels.map((level) => (
                <div
                  key={level}
                  className="dropdown-item"
                  onClick={() => handleZoomChange(level)}
                >
                  {level}%
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          className="btn-icon"
          onClick={() => handleZoomChange(Math.max(25, Math.round(canvas.zoom * 100) - 25))}
          title="Zoom Out"
        >
          <ZoomOut size={18} />
        </button>

        <button
          className="btn-icon"
          onClick={() => handleZoomChange(Math.min(200, Math.round(canvas.zoom * 100) + 25))}
          title="Zoom In"
        >
          <ZoomIn size={18} />
        </button>

        <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--color-border)' }} />

        {/* Undo/Redo */}
        <button
          className="btn-icon"
          onClick={undo}
          disabled={history.past.length === 0}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 size={18} />
        </button>

        <button
          className="btn-icon"
          onClick={redo}
          disabled={history.future.length === 0}
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo2 size={18} />
        </button>

        <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--color-border)' }} />

        {/* Update Button */}
        <button className="btn btn-primary" onClick={handleSave}>
          Update
        </button>

        {/* Theme Toggle */}
        <button className="btn-icon" onClick={toggleTheme} title="Toggle Theme">
          {editor.theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>
    </div>
  );
}
