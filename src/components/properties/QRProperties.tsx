import { useStore } from '../../store/store';
import type { QRElement } from '../../types/types';

interface QRPropertiesProps {
  element: QRElement;
}

export function QRProperties({ element }: QRPropertiesProps) {
  const { updateElement } = useStore();

  const handleUpdate = (updates: Partial<QRElement>) => {
    updateElement(element.id, updates);
  };

  return (
    <div>
      <div className="property-group">
        <label className="property-label">QR Code Data</label>
        <textarea
          value={element.data}
          onChange={(e) => handleUpdate({ data: e.target.value })}
          rows={4}
          placeholder="Enter URL or text..."
          style={{ width: '100%', resize: 'vertical' }}
        />
      </div>

      <div className="property-group">
        <label className="property-label">Foreground Color</label>
        <div className="flex items-center gap-sm">
          <input
            type="color"
            value={element.foregroundColor}
            onChange={(e) => handleUpdate({ foregroundColor: e.target.value })}
            className="color-picker"
          />
          <input
            type="text"
            value={element.foregroundColor}
            onChange={(e) => handleUpdate({ foregroundColor: e.target.value })}
            className="property-input"
          />
        </div>
      </div>

      <div className="property-group">
        <label className="property-label">Background Color</label>
        <div className="flex items-center gap-sm">
          <input
            type="color"
            value={element.backgroundColor}
            onChange={(e) => handleUpdate({ backgroundColor: e.target.value })}
            className="color-picker"
          />
          <input
            type="text"
            value={element.backgroundColor}
            onChange={(e) => handleUpdate({ backgroundColor: e.target.value })}
            className="property-input"
          />
        </div>
      </div>

      <div className="property-group">
        <label className="property-label">Error Correction Level</label>
        <select
          value={element.errorCorrectionLevel}
          onChange={(e) =>
            handleUpdate({ errorCorrectionLevel: e.target.value as 'L' | 'M' | 'Q' | 'H' })
          }
          style={{ width: '100%' }}
        >
          <option value="L">Low (7%)</option>
          <option value="M">Medium (15%)</option>
          <option value="Q">Quartile (25%)</option>
          <option value="H">High (30%)</option>
        </select>
      </div>
    </div>
  );
}
