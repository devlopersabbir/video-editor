import { useStore } from '../../store/store';
import { ImageProperties } from './ImageProperties';
import { TextProperties } from './TextProperties';
import { QRProperties } from './QRProperties';
import { ShapeProperties } from './ShapeProperties';

export function PropertiesPanel() {
  const { elements, canvas } = useStore();

  const selectedElement = canvas.selectedElementIds.length === 1
    ? elements.find((el) => el.id === canvas.selectedElementIds[0])
    : null;

  return (
    <div className="properties-panel panel">
      <div className="panel-header">Properties</div>
      <div className="panel-content" style={{ overflowY: 'auto', height: 'calc(100% - 60px)' }}>
        {selectedElement ? (
          <>
            {(selectedElement.type === 'image' || selectedElement.type === 'video') && (
              <ImageProperties element={selectedElement} />
            )}
            {selectedElement.type === 'text' && <TextProperties element={selectedElement} />}
            {selectedElement.type === 'qr' && <QRProperties element={selectedElement} />}
            {(selectedElement.type === 'rectangle' ||
              selectedElement.type === 'ellipse' ||
              selectedElement.type === 'triangle') && <ShapeProperties element={selectedElement} />}
          </>
        ) : (
          <div style={{ color: 'var(--color-text-secondary)', textAlign: 'center', paddingTop: 'var(--spacing-xl)' }}>
            Select an element to edit its properties
          </div>
        )}
      </div>
    </div>
  );
}
