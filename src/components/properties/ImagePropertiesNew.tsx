import { X, Lock } from 'lucide-react';
import { useStore } from '../../store/store';
import type { ImageElement, VideoElement } from '../../types/types';
import './PropertiesPanelNew.css';

export function ImagePropertiesNew() {
  const { canvas, updateElement, assets } = useStore();
  const selectedId = canvas.selectedElementIds[0];
  const element = useStore((state) => state.elements.find((el) => el.id === selectedId)) as ImageElement | VideoElement | undefined;

  if (!element || (element.type !== 'image' && element.type !== 'video')) return null;

  const asset = assets.find((a) => a.id === element.assetId);
  const duration = element.endTime - element.startTime;

  const handleDurationChange = (newDuration: number) => {
    updateElement(element.id, {
      endTime: element.startTime + newDuration,
    });
  };

  const handlePositionChange = (axis: 'x' | 'y', value: number) => {
    updateElement(element.id, {
      transform: {
        ...element.transform,
        [axis]: value,
      },
    });
  };

  const handleSizeChange = (dimension: 'width' | 'height', value: number) => {
    updateElement(element.id, {
      transform: {
        ...element.transform,
        [dimension]: Math.max(20, value),
      },
    });
  };

  const handleFreePositionToggle = () => {
    updateElement(element.id, {
      freePosition: !element.freePosition,
    });
  };

  const alignments = [
    { name: 'top-left', x: 0, y: 0 },
    { name: 'top-center', x: 960 - element.transform.width / 2, y: 0 },
    { name: 'top-right', x: 1920 - element.transform.width, y: 0 },
    { name: 'middle-left', x: 0, y: 540 - element.transform.height / 2 },
    { name: 'middle-center', x: 960 - element.transform.width / 2, y: 540 - element.transform.height / 2 },
    { name: 'middle-right', x: 1920 - element.transform.width, y: 540 - element.transform.height / 2 },
    { name: 'bottom-left', x: 0, y: 1080 - element.transform.height },
    { name: 'bottom-center', x: 960 - element.transform.width / 2, y: 1080 - element.transform.height },
    { name: 'bottom-right', x: 1920 - element.transform.width, y: 1080 - element.transform.height },
  ];

  const handleAlignment = (x: number, y: number) => {
    updateElement(element.id, {
      transform: {
        ...element.transform,
        x,
        y,
      },
    });
  };

  return (
    <div className="properties-panel-new">
      <div className="properties-header">
        <span className="properties-title">{asset?.name || 'Image'}</span>
        <button className="close-btn">
          <X size={16} />
        </button>
      </div>

      {/* Duration Section */}
      <div className="property-section">
        <label className="property-label">Duration</label>
        <div className="duration-input-group">
          <input
            type="text"
            className="time-input"
            value={`00:${Math.floor(duration).toString().padStart(2, '0')}:00`}
            readOnly
          />
        </div>
        <input
          type="range"
          className="duration-slider"
          min="1"
          max="30"
          step="0.1"
          value={duration}
          onChange={(e) => handleDurationChange(parseFloat(e.target.value))}
        />
      </div>

      {/* Free Position Toggle */}
      <div className="property-section">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={element.freePosition}
            onChange={handleFreePositionToggle}
          />
          <span>Free Position</span>
        </label>
      </div>

      {/* Position Section */}
      <div className="property-section">
        <label className="property-label">Position</label>
        <div className="slider-group">
          <div className="slider-row">
            <span className="slider-label">X</span>
            <input
              type="range"
              className="property-slider"
              min="0"
              max="1920"
              value={element.transform.x}
              onChange={(e) => handlePositionChange('x', parseFloat(e.target.value))}
            />
            <input
              type="number"
              className="slider-value"
              value={Math.round(element.transform.x)}
              onChange={(e) => handlePositionChange('x', parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="slider-row">
            <span className="slider-label">Y</span>
            <input
              type="range"
              className="property-slider"
              min="0"
              max="1080"
              value={element.transform.y}
              onChange={(e) => handlePositionChange('y', parseFloat(e.target.value))}
            />
            <input
              type="number"
              className="slider-value"
              value={Math.round(element.transform.y)}
              onChange={(e) => handlePositionChange('y', parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>
      </div>

      {/* Size Section */}
      <div className="property-section">
        <label className="property-label">Size</label>
        <div className="slider-group">
          <div className="slider-row">
            <span className="slider-label">W</span>
            <input
              type="range"
              className="property-slider"
              min="20"
              max="1920"
              value={element.transform.width}
              onChange={(e) => handleSizeChange('width', parseFloat(e.target.value))}
            />
            <input
              type="number"
              className="slider-value"
              value={Math.round(element.transform.width)}
              onChange={(e) => handleSizeChange('width', parseFloat(e.target.value) || 20)}
            />
          </div>
          <div className="slider-row">
            <span className="slider-label">H</span>
            <input
              type="range"
              className="property-slider"
              min="20"
              max="1080"
              value={element.transform.height}
              onChange={(e) => handleSizeChange('height', parseFloat(e.target.value))}
            />
            <input
              type="number"
              className="slider-value"
              value={Math.round(element.transform.height)}
              onChange={(e) => handleSizeChange('height', parseFloat(e.target.value) || 20)}
            />
          </div>
        </div>
        <button className="lock-aspect-btn">
          <Lock size={14} />
        </button>
      </div>

      {/* Alignment Section */}
      <div className="property-section">
        <label className="property-label">Alignment</label>
        <div className="alignment-grid">
          {alignments.map((align, index) => (
            <button
              key={align.name}
              className="alignment-btn"
              onClick={() => handleAlignment(align.x, align.y)}
              title={align.name}
            >
              <div className={`align-icon align-${index}`}></div>
            </button>
          ))}
        </div>
      </div>

      {/* Video Volume */}
      {element.type === 'video' && (
        <div className="property-section">
          <label className="property-label">Volume</label>
          <div className="slider-row">
            <input
              type="range"
              className="property-slider"
              min="0"
              max="1"
              step="0.01"
              value={element.volume}
              onChange={(e) => updateElement(element.id, { volume: parseFloat(e.target.value) })}
            />
            <input
              type="number"
              className="slider-value"
              value={Math.round(element.volume * 100)}
              onChange={(e) => updateElement(element.id, { volume: (parseFloat(e.target.value) || 0) / 100 })}
            />
          </div>
        </div>
      )}
    </div>
  );
}
