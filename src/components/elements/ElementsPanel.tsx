import { Type, QrCode, Square, Circle, Triangle } from 'lucide-react';
import { useStore } from '../../store/store';
import type { TextElement, QRElement, ShapeElement } from '../../types/types';

export function ElementsPanel() {
  const { addElement, timeline, editor } = useStore();

  const createElement = (type: 'text' | 'qr' | 'rectangle' | 'ellipse' | 'triangle') => {
    const baseElement = {
      id: `element-${Date.now()}`,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${Date.now()}`,
      transform: {
        x: editor.canvasWidth / 2 - 100,
        y: editor.canvasHeight / 2 - 50,
        width: 200,
        height: 100,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
      },
      startTime: timeline.playheadPosition,
      endTime: timeline.playheadPosition + 5,
      layerId: 'layer-video',
      pageId: timeline.currentPageId,
      freePosition: true,
      locked: false,
      visible: true,
    };

    if (type === 'text') {
      const element: TextElement = {
        ...baseElement,
        type: 'text',
        content: 'Title Goes There',
        fontFamily: 'Inter',
        fontSize: 32,
        fontWeight: 600,
        color: '#000000',
        textAlign: 'center',
      };
      addElement(element);
    } else if (type === 'qr') {
      const element: QRElement = {
        ...baseElement,
        type: 'qr',
        data: 'https://example.com',
        foregroundColor: '#000000',
        backgroundColor: '#ffffff',
        errorCorrectionLevel: 'M',
      };
      addElement(element);
    } else {
      const element: ShapeElement = {
        ...baseElement,
        type,
        fillColor: '#0095ff',
        strokeColor: '#000000',
        strokeWidth: 0,
        ...(type === 'rectangle' && { cornerRadius: 0 }),
      };
      addElement(element);
    }
  };

  const elements = [
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'qr', icon: QrCode, label: 'QR Code' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'ellipse', icon: Circle, label: 'Ellipse' },
    { id: 'triangle', icon: Triangle, label: 'Triangle' },
  ] as const;

  return (
    <div className="panel" style={{ gridArea: 'assets' }}>
      <div className="panel-header">Elements</div>
      <div className="panel-content">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 'var(--spacing-md)',
          }}
        >
          {elements.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              className="btn-secondary flex flex-col items-center justify-center gap-sm"
              style={{ padding: 'var(--spacing-lg)', aspectRatio: '1' }}
              onClick={() => createElement(id)}
            >
              <Icon size={32} />
              <span className="text-sm">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
