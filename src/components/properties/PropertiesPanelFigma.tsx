import { useState } from 'react';
import { Copy, ArrowUp, ArrowDown, Trash2, Plus, ChevronDown } from 'lucide-react';
import { useStore } from '../../store/store';
import './PropertiesPanelFigma.css';

const LAYOUT_PRESETS = [
  { id: '1-1', name: '1:1', icon: '▢' },
  { id: '1-2', name: '1:2', icon: '▭' },
  { id: '2-1', name: '2:1', icon: '▬' },
  { id: '2-2', name: '2:2', icon: '▦' },
  { id: '3-3', name: '3:3', icon: '▦' },
  { id: '1-3', name: '1:3', icon: '▭' },
];

const ANIMATION_PRESETS = {
  enter: ['Fade In', 'Zoom In', 'Slide In', 'Bounce In'],
  emphasis: ['Pulse', 'Shake', 'Swing', 'Flash'],
  exit: ['Fade Out', 'Zoom Out', 'Slide Out', 'Bounce Out'],
};

export function PropertiesPanelFigma() {
  const { timeline, canvas, elements, updateElement } = useStore();
  const [selectedLayout, setSelectedLayout] = useState('1');
  const [backgroundColor, setBackgroundColor] = useState('#FCFAFF');
  const [duration, setDuration] = useState('00:10:00');
  const [showLayoutGrid, setShowLayoutGrid] = useState(false);
  const [showAnimationMenu, setShowAnimationMenu] = useState(false);
  const [animationCategory, setAnimationCategory] = useState<'enter' | 'emphasis' | 'exit'>('enter');
  const [activeAnimations, setActiveAnimations] = useState<Array<{ name: string; duration: number }>>([
    { name: 'Fade In', duration: 1.5 },
  ]);

  const currentPage = timeline.pages.find(p => p.id === timeline.currentPageId);
  const selectedElementId = canvas.selectedElementIds[0];
  const selectedElement = elements.find(el => el.id === selectedElementId);

  const handleDuplicate = () => {
    console.log('Duplicate page');
  };

  const handleMoveForward = () => {
    console.log('Move forward');
  };

  const handleMoveBackward = () => {
    console.log('Move backward');
  };

  const handleDelete = () => {
    console.log('Delete page');
  };

  const handleAddAnimation = (animationName: string) => {
    setActiveAnimations([...activeAnimations, { name: animationName, duration: 1.5 }]);
    setShowAnimationMenu(false);
  };

  const handleRemoveAnimation = (index: number) => {
    setActiveAnimations(activeAnimations.filter((_, i) => i !== index));
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBackgroundColor(e.target.value);
  };

  return (
    <div className="properties-panel-figma">
      {/* Page Header */}
      <div className="panel-header-figma">
        <h3 className="page-title">
          {currentPage?.name || 'Page 1'}
          <button className="edit-btn">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M10 2L12 4L5 11H3V9L10 2Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            </svg>
          </button>
        </h3>
        
        <div className="action-buttons">
          <button className="action-btn" onClick={handleDuplicate} title="Duplicate">
            <Copy size={14} />
          </button>
          <button className="action-btn" onClick={handleMoveForward} title="Move Forward">
            <ArrowUp size={14} />
          </button>
          <button className="action-btn" onClick={handleMoveBackward} title="Move Backward">
            <ArrowDown size={14} />
          </button>
          <button className="action-btn delete-btn" onClick={handleDelete} title="Delete">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="panel-content-figma">
        {/* Layout Section */}
        <div className="property-section">
          <label className="section-label">Layout</label>
          <div className="layout-dropdown-container">
            <button 
              className="layout-dropdown"
              onClick={() => setShowLayoutGrid(!showLayoutGrid)}
            >
              <span>{selectedLayout}</span>
              <ChevronDown size={16} />
            </button>
            
            {showLayoutGrid && (
              <div className="layout-grid-popup">
                <div className="popup-header">Select Layout</div>
                <div className="layout-grid">
                  {LAYOUT_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      className={`layout-preset ${selectedLayout === preset.id ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedLayout(preset.id);
                        setShowLayoutGrid(false);
                      }}
                    >
                      <span className="preset-icon">{preset.icon}</span>
                      <span className="preset-name">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Background Section */}
        <div className="property-section">
          <label className="section-label">Background</label>
          <div className="background-type-dropdown">
            <button className="type-dropdown">
              <span>Color</span>
              <ChevronDown size={16} />
            </button>
          </div>
          <div className="color-input-group">
            <div 
              className="color-swatch"
              style={{ backgroundColor }}
              onClick={() => document.getElementById('bg-color-input')?.click()}
            />
            <input
              id="bg-color-input"
              type="color"
              value={backgroundColor}
              onChange={handleColorChange}
              style={{ display: 'none' }}
            />
            <input
              type="text"
              className="hex-input"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              placeholder="#FCFAFF"
            />
          </div>
        </div>

        {/* Duration Section */}
        <div className="property-section">
          <label className="section-label">Duration</label>
          <div className="duration-input-container">
            <input
              type="text"
              className="duration-input"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="00:10:00"
            />
            <span className="duration-label">hr:min:sec</span>
          </div>
        </div>

        {/* Animation Section */}
        <div className="property-section">
          <div className="section-header-with-action">
            <label className="section-label">Animation</label>
            <button 
              className="add-animation-btn"
              onClick={() => setShowAnimationMenu(!showAnimationMenu)}
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Active Animations List */}
          {activeAnimations.length > 0 && (
            <div className="active-animations">
              {activeAnimations.map((anim, index) => (
                <div key={index} className="animation-item">
                  <span className="animation-name">{anim.name}</span>
                  <div className="animation-controls">
                    <span className="animation-duration">{anim.duration}s</span>
                    <button 
                      className="remove-animation-btn"
                      onClick={() => handleRemoveAnimation(index)}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Animation Menu */}
          {showAnimationMenu && (
            <div className="animation-menu-popup">
              <div className="animation-categories">
                <button
                  className={`category-tab ${animationCategory === 'enter' ? 'active' : ''}`}
                  onClick={() => setAnimationCategory('enter')}
                >
                  Enter
                </button>
                <button
                  className={`category-tab ${animationCategory === 'emphasis' ? 'active' : ''}`}
                  onClick={() => setAnimationCategory('emphasis')}
                >
                  Emphasis
                </button>
                <button
                  className={`category-tab ${animationCategory === 'exit' ? 'active' : ''}`}
                  onClick={() => setAnimationCategory('exit')}
                >
                  Exit
                </button>
              </div>
              <div className="animation-list">
                {ANIMATION_PRESETS[animationCategory].map((anim) => (
                  <button
                    key={anim}
                    className="animation-preset-btn"
                    onClick={() => handleAddAnimation(anim)}
                  >
                    {anim}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Element Properties (if element is selected) */}
        {selectedElement && (
          <div className="element-properties">
            <div className="property-divider" />
            <div className="property-section">
              <label className="section-label">Element: {selectedElement.name}</label>
              <p className="element-type-label">Type: {selectedElement.type}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
