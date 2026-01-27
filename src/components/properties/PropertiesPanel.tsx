import { useStore } from '../../store/store';
import { ImagePropertiesNew } from './ImagePropertiesNew';
import { TextPropertiesNew } from './TextPropertiesNew';
import { QRProperties } from './QRProperties';
import { ShapeProperties } from './ShapeProperties';

export function PropertiesPanel() {
  const { canvas, elements } = useStore();
  const selectedId = canvas.selectedElementIds[0];
  const selectedElement = elements.find((el) => el.id === selectedId);

  if (!selectedElement) {
    return (
      <div className="properties-area panel" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'var(--color-text-secondary)',
        fontSize: '0.875rem'
      }}>
        Select an element to edit its properties
      </div>
    );
  }

  return (
    <div className="properties-area">
      {(selectedElement.type === 'image' || selectedElement.type === 'video') && <ImagePropertiesNew />}
      {selectedElement.type === 'text' && <TextPropertiesNew />}
      {selectedElement.type === 'qr' && <QRProperties />}
      {(selectedElement.type === 'rectangle' || selectedElement.type === 'ellipse' || selectedElement.type === 'triangle') && <ShapeProperties />}
    </div>
  );
}
