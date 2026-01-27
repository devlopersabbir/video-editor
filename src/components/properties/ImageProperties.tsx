import { useStore } from '../../store/store';
import { ChevronUp, ChevronDown, Trash2, Lock } from 'lucide-react';
import type { ImageElement, VideoElement } from '../../types/types';
import { formatTimeLong } from '../../utils/time-utils';

interface ImagePropertiesProps {
  element: ImageElement | VideoElement;
}

export function ImageProperties({ element }: ImagePropertiesProps) {
  const { updateElement, removeElement } = useStore();

  const handleUpdate = (updates: Partial<ImageElement | VideoElement>) => {
    updateElement(element.id, updates);
  };

  return (
    <div>
      <div className="property-group">
        <div className="flex items-center justify-between" style={{ marginBottom: 'var(--spacing-md)' }}>
          <span className="font-semibold">{element.name}</span>
          <div className="flex gap-xs">
            <button className="btn-icon" title="Move Up">
              <ChevronUp size={16} />
            </button>
            <button className="btn-icon" title="Move Down">
              <ChevronDown size={16} />
            </button>
            <button className="btn-icon" onClick={() => removeElement(element.id)} title="Delete">
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <label className="property-label">Duration</label>
        <div className="property-row">
          <div className="flex-1">
            <label className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Start</label>
            <input
              type="text"
              value={formatTimeLong(element.startTime)}
              readOnly
              className="property-input"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>End</label>
            <input
              type="text"
              value={formatTimeLong(element.endTime)}
              readOnly
              className="property-input"
            />
          </div>
        </div>
      </div>

      <div className="property-group">
        <div className="flex items-center justify-between">
          <label className="property-label">Free Position</label>
          <div
            className={`toggle ${element.freePosition ? 'active' : ''}`}
            onClick={() => handleUpdate({ freePosition: !element.freePosition })}
          >
            <div className="toggle-thumb" />
          </div>
        </div>
      </div>

      <div className="property-group">
        <label className="property-label">Position</label>
        <div className="property-row">
          <div className="flex-1">
            <label className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>X-Axis</label>
            <input
              type="number"
              value={Math.round(element.transform.x)}
              onChange={(e) =>
                handleUpdate({
                  transform: { ...element.transform, x: Number(e.target.value) },
                })
              }
              className="property-input"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Y-Axis</label>
            <input
              type="number"
              value={Math.round(element.transform.y)}
              onChange={(e) =>
                handleUpdate({
                  transform: { ...element.transform, y: Number(e.target.value) },
                })
              }
              className="property-input"
            />
          </div>
        </div>
      </div>

      <div className="property-group">
        <label className="property-label">Size</label>
        <div className="property-row">
          <div className="flex-1">
            <label className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Width</label>
            <input
              type="number"
              value={Math.round(element.transform.width)}
              onChange={(e) =>
                handleUpdate({
                  transform: { ...element.transform, width: Number(e.target.value) },
                })
              }
              className="property-input"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Height</label>
            <input
              type="number"
              value={Math.round(element.transform.height)}
              onChange={(e) =>
                handleUpdate({
                  transform: { ...element.transform, height: Number(e.target.value) },
                })
              }
              className="property-input"
            />
          </div>
          <button className="btn-icon" title="Lock Aspect Ratio">
            <Lock size={16} />
          </button>
        </div>
      </div>

      <div className="property-group">
        <label className="property-label">Opacity</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={element.opacity}
          onChange={(e) => handleUpdate({ opacity: Number(e.target.value) })}
          style={{ width: '100%' }}
        />
        <div className="text-xs text-center" style={{ color: 'var(--color-text-secondary)' }}>
          {Math.round(element.opacity * 100)}%
        </div>
      </div>

      {element.type === 'video' && (
        <div className="property-group">
          <label className="property-label">Volume</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={element.volume}
            onChange={(e) => handleUpdate({ volume: Number(e.target.value) })}
            style={{ width: '100%' }}
          />
          <div className="text-xs text-center" style={{ color: 'var(--color-text-secondary)' }}>
            {Math.round(element.volume * 100)}%
          </div>
        </div>
      )}
    </div>
  );
}
