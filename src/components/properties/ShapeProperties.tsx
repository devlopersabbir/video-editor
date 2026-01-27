import { useStore } from '../../store/store';
import type { ShapeElement } from '../../types/types';

interface ShapePropertiesProps {
  element: ShapeElement;
}

export function ShapeProperties({ element }: ShapePropertiesProps) {
  const { updateElement } = useStore();

  const handleUpdate = (updates: Partial<ShapeElement>) => {
    updateElement(element.id, updates);
  };

  return (
    <div>
      <div className="property-group">
        <label className="property-label">Fill Color</label>
        <div className="flex items-center gap-sm">
          <input
            type="color"
            value={element.fillColor}
            onChange={(e) => handleUpdate({ fillColor: e.target.value })}
            className="color-picker"
          />
          <input
            type="text"
            value={element.fillColor}
            onChange={(e) => handleUpdate({ fillColor: e.target.value })}
            className="property-input"
          />
        </div>
      </div>

      <div className="property-group">
        <label className="property-label">Stroke Color</label>
        <div className="flex items-center gap-sm">
          <input
            type="color"
            value={element.strokeColor}
            onChange={(e) => handleUpdate({ strokeColor: e.target.value })}
            className="color-picker"
          />
          <input
            type="text"
            value={element.strokeColor}
            onChange={(e) => handleUpdate({ strokeColor: e.target.value })}
            className="property-input"
          />
        </div>
      </div>

      <div className="property-group">
        <label className="property-label">Stroke Width</label>
        <input
          type="number"
          value={element.strokeWidth}
          onChange={(e) => handleUpdate({ strokeWidth: Number(e.target.value) })}
          min="0"
          max="20"
          style={{ width: '100%' }}
        />
      </div>

      {element.type === 'rectangle' && (
        <div className="property-group">
          <label className="property-label">Corner Radius</label>
          <input
            type="number"
            value={element.cornerRadius || 0}
            onChange={(e) => handleUpdate({ cornerRadius: Number(e.target.value) })}
            min="0"
            max="100"
            style={{ width: '100%' }}
          />
        </div>
      )}
    </div>
  );
}
