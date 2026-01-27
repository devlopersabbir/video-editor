import { X } from 'lucide-react';
import { useStore } from '../../store/store';
import type { TextElement } from '../../types/types';
import './PropertiesPanelNew.css';

export function TextPropertiesNew() {
  const { canvas, updateElement } = useStore();
  const selectedId = canvas.selectedElementIds[0];
  const element = useStore((state) => state.elements.find((el) => el.id === selectedId)) as TextElement | undefined;

  if (!element || element.type !== 'text') return null;

  return (
    <div className="properties-panel-new">
      <div className="properties-header">
        <span className="properties-title">Text</span>
        <button className="close-btn">
          <X size={16} />
        </button>
      </div>

      {/* Text Content */}
      <div className="property-section">
        <label className="property-label">Text Content</label>
        <textarea
          className="text-content-input"
          value={element.content}
          onChange={(e) => updateElement(element.id, { content: e.target.value })}
          rows={3}
          placeholder="Enter text..."
        />
      </div>

      {/* Text Color */}
      <div className="property-section">
        <label className="property-label">Text Color</label>
        <div className="color-input-group">
          <input
            type="color"
            className="color-picker"
            value={element.color}
            onChange={(e) => updateElement(element.id, { color: e.target.value })}
          />
          <input
            type="text"
            className="color-hex-input"
            value={element.color}
            onChange={(e) => updateElement(element.id, { color: e.target.value })}
          />
        </div>
      </div>

      {/* Font */}
      <div className="property-section">
        <label className="property-label">Font</label>
        <select
          className="font-select"
          value={element.fontFamily}
          onChange={(e) => updateElement(element.id, { fontFamily: e.target.value })}
        >
          <option value="Inter">Inter</option>
          <option value="Arial">Arial</option>
          <option value="Helvetica">Helvetica</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Georgia">Georgia</option>
          <option value="Courier New">Courier New</option>
        </select>
      </div>

      {/* Weight and Font Size */}
      <div className="property-section">
        <div className="two-column-group">
          <div>
            <label className="property-label">Weight</label>
            <select
              className="weight-select"
              value={element.fontWeight}
              onChange={(e) => updateElement(element.id, { fontWeight: parseInt(e.target.value) })}
            >
              <option value="300">Light (300)</option>
              <option value="400">Regular (400)</option>
              <option value="500">Medium (500)</option>
              <option value="600">Semibold (600)</option>
              <option value="700">Bold (700)</option>
              <option value="800">Extra Bold (800)</option>
            </select>
          </div>
          <div>
            <label className="property-label">Font Size</label>
            <input
              type="number"
              className="font-size-input"
              value={element.fontSize}
              onChange={(e) => updateElement(element.id, { fontSize: parseInt(e.target.value) || 16 })}
              min="8"
              max="200"
            />
          </div>
        </div>
      </div>

      {/* Text Alignment */}
      <div className="property-section">
        <label className="property-label">Text Alignment</label>
        <div className="alignment-buttons">
          <button
            className={`align-text-btn ${element.textAlign === 'left' ? 'active' : ''}`}
            onClick={() => updateElement(element.id, { textAlign: 'left' })}
          >
            Left
          </button>
          <button
            className={`align-text-btn ${element.textAlign === 'center' ? 'active' : ''}`}
            onClick={() => updateElement(element.id, { textAlign: 'center' })}
          >
            Center
          </button>
          <button
            className={`align-text-btn ${element.textAlign === 'right' ? 'active' : ''}`}
            onClick={() => updateElement(element.id, { textAlign: 'right' })}
          >
            Right
          </button>
        </div>
      </div>

      {/* Animation */}
      <div className="property-section">
        <label className="property-label">Animation</label>
        <select
          className="animation-select"
          value={element.animation?.type || 'none'}
          onChange={(e) => updateElement(element.id, { 
            animation: { type: e.target.value as any, duration: 1 } 
          })}
        >
          <option value="none">None</option>
          <option value="fade">Fade</option>
          <option value="slide">Slide</option>
          <option value="zoom">Zoom</option>
        </select>
      </div>
    </div>
  );
}
