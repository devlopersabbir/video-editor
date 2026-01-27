import { useState } from 'react';
import { useStore } from '../../store/store';
import type { Element } from '../../types/types';

interface TransformHandle {
  type: 'corner' | 'edge' | 'rotate';
  position: 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'rotate';
  cursor: string;
}

const HANDLES: TransformHandle[] = [
  { type: 'corner', position: 'nw', cursor: 'nwse-resize' },
  { type: 'edge', position: 'n', cursor: 'ns-resize' },
  { type: 'corner', position: 'ne', cursor: 'nesw-resize' },
  { type: 'edge', position: 'e', cursor: 'ew-resize' },
  { type: 'corner', position: 'se', cursor: 'nwse-resize' },
  { type: 'edge', position: 's', cursor: 'ns-resize' },
  { type: 'corner', position: 'sw', cursor: 'nesw-resize' },
  { type: 'edge', position: 'w', cursor: 'ew-resize' },
  { type: 'rotate', position: 'rotate', cursor: 'grab' },
];

interface TransformControlsProps {
  element: Element;
  zoom: number;
}

export function TransformControls({ element, zoom }: TransformControlsProps) {
  const { updateElement } = useStore();

  const getHandlePosition = (position: TransformHandle['position']) => {
    const { width, height } = element.transform;
    const handleSize = 8 / zoom;

    switch (position) {
      case 'nw':
        return { x: -handleSize / 2, y: -handleSize / 2 };
      case 'n':
        return { x: width / 2 - handleSize / 2, y: -handleSize / 2 };
      case 'ne':
        return { x: width - handleSize / 2, y: -handleSize / 2 };
      case 'e':
        return { x: width - handleSize / 2, y: height / 2 - handleSize / 2 };
      case 'se':
        return { x: width - handleSize / 2, y: height - handleSize / 2 };
      case 's':
        return { x: width / 2 - handleSize / 2, y: height - handleSize / 2 };
      case 'sw':
        return { x: -handleSize / 2, y: height - handleSize / 2 };
      case 'w':
        return { x: -handleSize / 2, y: height / 2 - handleSize / 2 };
      case 'rotate':
        return { x: width / 2 - handleSize / 2, y: -30 / zoom };
      default:
        return { x: 0, y: 0 };
    }
  };

  const handleMouseDown = (handle: TransformHandle, e: React.MouseEvent) => {
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const startTransform = { ...element.transform };

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = (e.clientX - startX) / zoom;
      const deltaY = (e.clientY - startY) / zoom;

      if (handle.type === 'corner' || handle.type === 'edge') {
        let newWidth = startTransform.width;
        let newHeight = startTransform.height;
        let newX = startTransform.x;
        let newY = startTransform.y;

        // Handle resizing based on position
        if (handle.position.includes('e')) {
          newWidth = Math.max(20, startTransform.width + deltaX);
        }
        if (handle.position.includes('w')) {
          newWidth = Math.max(20, startTransform.width - deltaX);
          newX = startTransform.x + deltaX;
        }
        if (handle.position.includes('s')) {
          newHeight = Math.max(20, startTransform.height + deltaY);
        }
        if (handle.position.includes('n')) {
          newHeight = Math.max(20, startTransform.height - deltaY);
          newY = startTransform.y + deltaY;
        }

        updateElement(element.id, {
          transform: {
            ...startTransform,
            x: newX,
            y: newY,
            width: newWidth,
            height: newHeight,
          },
        });
      } else if (handle.type === 'rotate') {
        // Calculate rotation angle
        const centerX = startTransform.x + startTransform.width / 2;
        const centerY = startTransform.y + startTransform.height / 2;
        const angle = Math.atan2(e.clientY / zoom - centerY, e.clientX / zoom - centerX);
        const degrees = (angle * 180) / Math.PI + 90;

        updateElement(element.id, {
          transform: {
            ...startTransform,
            rotation: degrees,
          },
        });
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleSize = 8 / zoom;

  return (
    <g>
      {/* Selection outline */}
      <rect
        x={-2 / zoom}
        y={-2 / zoom}
        width={element.transform.width + 4 / zoom}
        height={element.transform.height + 4 / zoom}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth={2 / zoom}
        pointerEvents="none"
      />

      {/* Transform handles */}
      {HANDLES.map((handle) => {
        const pos = getHandlePosition(handle.position);
        
        if (handle.type === 'rotate') {
          return (
            <g key={handle.position}>
              {/* Rotation line */}
              <line
                x1={element.transform.width / 2}
                y1={0}
                x2={element.transform.width / 2}
                y2={-25 / zoom}
                stroke="var(--color-accent)"
                strokeWidth={1 / zoom}
                pointerEvents="none"
              />
              {/* Rotation handle */}
              <circle
                cx={pos.x + handleSize / 2}
                cy={pos.y + handleSize / 2}
                r={handleSize}
                fill="white"
                stroke="var(--color-accent)"
                strokeWidth={2 / zoom}
                cursor={handle.cursor}
                onMouseDown={(e) => handleMouseDown(handle, e)}
                style={{ cursor: handle.cursor }}
              />
            </g>
          );
        }

        return (
          <rect
            key={handle.position}
            x={pos.x}
            y={pos.y}
            width={handleSize}
            height={handleSize}
            fill="white"
            stroke="var(--color-accent)"
            strokeWidth={2 / zoom}
            cursor={handle.cursor}
            onMouseDown={(e) => handleMouseDown(handle, e)}
            style={{ cursor: handle.cursor }}
          />
        );
      })}
    </g>
  );
}
