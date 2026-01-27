import { useStore } from '../../store/store';
import type { TextElement } from '../../types/types';

interface TextPropertiesProps {
  element: TextElement;
}

export function TextProperties({ element }: TextPropertiesProps) {
  const { updateElement } = useStore();

  const handleUpdate = (updates: Partial<TextElement>) => {
    updateElement(element.id, updates);
  };

  const fontFamilies = ['Inter', 'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Courier New'];
  const fontWeights = [300, 400, 500, 600, 700, 800];

  return (
    <div>
      <div className="property-group">
        <label className="property-label">Type Content</label>
        <textarea
          value={element.content}
          onChange={(e) => handleUpdate({ content: e.target.value })}
          rows={4}
          style={{ width: '100%', resize: 'vertical' }}
        />
      </div>

      <div className="property-group">
        <label className="property-label">Text Color</label>
        <div className="flex items-center gap-sm">
          <input
            type="color"
            value={element.color}
            onChange={(e) => handleUpdate({ color: e.target.value })}
            className="color-picker"
          />
          <input
            type="text"
            value={element.color}
            onChange={(e) => handleUpdate({ color: e.target.value })}
            className="property-input"
          />
        </div>
      </div>

      <div className="property-group">
        <label className="property-label">Font</label>
        <select
          value={element.fontFamily}
          onChange={(e) => handleUpdate({ fontFamily: e.target.value })}
          style={{ width: '100%' }}
        >
          {fontFamilies.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>
      </div>

      <div className="property-group">
        <label className="property-label">Font Weight</label>
        <select
          value={element.fontWeight}
          onChange={(e) => handleUpdate({ fontWeight: Number(e.target.value) })}
          style={{ width: '100%' }}
        >
          {fontWeights.map((weight) => (
            <option key={weight} value={weight}>
              {weight}
            </option>
          ))}
        </select>
      </div>

      <div className="property-group">
        <label className="property-label">Font Size</label>
        <input
          type="number"
          value={element.fontSize}
          onChange={(e) => handleUpdate({ fontSize: Number(e.target.value) })}
          min="8"
          max="200"
          style={{ width: '100%' }}
        />
      </div>

      <div className="property-group">
        <label className="property-label">Text Align</label>
        <div className="flex gap-sm">
          {(['left', 'center', 'right'] as const).map((align) => (
            <button
              key={align}
              className={`btn-secondary flex-1 ${element.textAlign === align ? 'active' : ''}`}
              onClick={() => handleUpdate({ textAlign: align })}
            >
              {align.charAt(0).toUpperCase() + align.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="property-group">
        <label className="property-label">Animation</label>
        <select style={{ width: '100%' }}>
          <option value="none">None</option>
          <option value="fade">Fade</option>
          <option value="slide">Slide</option>
          <option value="zoom">Zoom</option>
        </select>
      </div>
    </div>
  );
}
