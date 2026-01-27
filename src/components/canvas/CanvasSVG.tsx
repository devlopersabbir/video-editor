import { useRef, useState } from 'react';
import { useStore } from '../../store/store';
import { screenToCanvas } from '../../utils/canvas-utils';
import type { Element } from '../../types/types';

export function CanvasSVG() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { elements, assets, canvas, editor, selectElement, clearSelection, updateElement } = useStore();
  const [draggingElement, setDraggingElement] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleElementMouseDown = (element: Element, e: React.MouseEvent<SVGGElement>) => {
    e.stopPropagation();
    
    if (!canvas.selectedElementIds.includes(element.id)) {
      selectElement(element.id, e.shiftKey);
    }

    setDraggingElement(element.id);
    setDragOffset({
      x: e.clientX / canvas.zoom - element.transform.x,
      y: e.clientY / canvas.zoom - element.transform.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (draggingElement) {
      const element = elements.find((el) => el.id === draggingElement);
      if (!element) return;

      const newX = e.clientX / canvas.zoom - dragOffset.x;
      const newY = e.clientY / canvas.zoom - dragOffset.y;

      updateElement(draggingElement, {
        transform: {
          ...element.transform,
          x: newX,
          y: newY,
        },
      });
    }
  };

  const handleMouseUp = () => {
    setDraggingElement(null);
  };

  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (e.target === e.currentTarget) {
      clearSelection();
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const assetId = e.dataTransfer.getData('assetId');
    if (!assetId || !containerRef.current) return;

    const asset = assets.find((a) => a.id === assetId);
    if (!asset || (asset.type !== 'image' && asset.type !== 'video')) return;

    const rect = containerRef.current.getBoundingClientRect();
    const { x, y } = screenToCanvas(e.clientX, e.clientY, rect, canvas.zoom, canvas.panX, canvas.panY);

    const element = {
      id: `element-${Date.now()}`,
      type: asset.type,
      name: asset.name,
      assetId: asset.id,
      transform: {
        x: x - 200,
        y: y - 150,
        width: 400,
        height: 300,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
      },
      startTime: useStore.getState().timeline.playheadPosition,
      endTime: useStore.getState().timeline.playheadPosition + (asset.type === 'video' ? asset.duration || 5 : 5),
      layerId: 'layer-video',
      pageId: useStore.getState().timeline.currentPageId,
      freePosition: true,
      locked: false,
      visible: true,
      opacity: 1,
      ...(asset.type === 'video' && { volume: 1 }),
    };

    useStore.getState().addElement(element as any);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const currentPageElements = elements.filter((el) => el.pageId === useStore.getState().timeline.currentPageId);

  return (
    <div
      ref={containerRef}
      className="canvas-area canvas-container"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{
        backgroundColor: 'var(--color-canvas-bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <svg
        width={editor.canvasWidth * canvas.zoom}
        height={editor.canvasHeight * canvas.zoom}
        viewBox={`0 0 ${editor.canvasWidth} ${editor.canvasHeight}`}
        style={{
          backgroundColor: '#ffffff',
          boxShadow: 'var(--shadow-lg)',
          cursor: draggingElement ? 'grabbing' : 'default',
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleCanvasClick}
      >
        {currentPageElements.map((element) => (
          <g
            key={element.id}
            transform={`translate(${element.transform.x}, ${element.transform.y}) rotate(${element.transform.rotation}, ${element.transform.width / 2}, ${element.transform.height / 2})`}
            onMouseDown={(e) => handleElementMouseDown(element, e)}
            style={{ cursor: 'move' }}
          >
            {renderElement(element, assets)}
            
            {/* Show selection outline and handles for selected elements */}
            {canvas.selectedElementIds.includes(element.id) && (
              <g>
                <rect
                  x={-2}
                  y={-2}
                  width={element.transform.width + 4}
                  height={element.transform.height + 4}
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeWidth={2 / canvas.zoom}
                  pointerEvents="none"
                />
              </g>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

function renderElement(element: Element, assets: any[]) {
  if (element.type === 'image' || element.type === 'video') {
    const asset = assets.find((a) => a.id === element.assetId);
    if (!asset) return null;

    return (
      <image
        href={asset.url}
        width={element.transform.width}
        height={element.transform.height}
        opacity={element.opacity}
        preserveAspectRatio="none"
      />
    );
  }

  if (element.type === 'text') {
    return (
      <text
        x={element.textAlign === 'center' ? element.transform.width / 2 : element.textAlign === 'right' ? element.transform.width : 0}
        y={element.fontSize}
        fontFamily={element.fontFamily}
        fontSize={element.fontSize}
        fontWeight={element.fontWeight}
        fill={element.color}
        textAnchor={element.textAlign === 'left' ? 'start' : element.textAlign === 'right' ? 'end' : 'middle'}
      >
        {element.content}
      </text>
    );
  }

  if (element.type === 'rectangle') {
    return (
      <rect
        width={element.transform.width}
        height={element.transform.height}
        fill={element.fillColor}
        stroke={element.strokeColor}
        strokeWidth={element.strokeWidth}
        rx={element.cornerRadius || 0}
      />
    );
  }

  if (element.type === 'ellipse') {
    return (
      <ellipse
        cx={element.transform.width / 2}
        cy={element.transform.height / 2}
        rx={element.transform.width / 2}
        ry={element.transform.height / 2}
        fill={element.fillColor}
        stroke={element.strokeColor}
        strokeWidth={element.strokeWidth}
      />
    );
  }

  if (element.type === 'triangle') {
    const points = `${element.transform.width / 2},0 ${element.transform.width},${element.transform.height} 0,${element.transform.height}`;
    return (
      <polygon
        points={points}
        fill={element.fillColor}
        stroke={element.strokeColor}
        strokeWidth={element.strokeWidth}
      />
    );
  }

  return null;
}
