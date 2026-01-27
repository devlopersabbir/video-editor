import { useRef, useEffect } from 'react';
import { useStore } from '../../store/store';
import { screenToCanvas } from '../../utils/canvas-utils';

export function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { elements, assets, canvas, editor, selectElement, clearSelection } = useStore();

  // Render canvas
  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;

    const ctx = canvasEl.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvasEl.width = editor.canvasWidth * canvas.zoom;
    canvasEl.height = editor.canvasHeight * canvas.zoom;

    // Clear canvas
    ctx.fillStyle = 'var(--color-canvas-bg)';
    ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);

    // Apply zoom
    ctx.scale(canvas.zoom, canvas.zoom);

    // Render elements
    elements.forEach((element) => {
      if (!element.visible) return;

      ctx.save();
      ctx.translate(element.transform.x, element.transform.y);
      ctx.rotate((element.transform.rotation * Math.PI) / 180);

      if (element.type === 'image' || element.type === 'video') {
        const asset = assets.find((a) => a.id === element.assetId);
        if (asset && asset.url) {
          const img = new Image();
          img.src = asset.url;
          if (img.complete) {
            ctx.globalAlpha = element.opacity;
            ctx.drawImage(img, 0, 0, element.transform.width, element.transform.height);
            ctx.globalAlpha = 1;
          }
        }
      } else if (element.type === 'text') {
        ctx.font = `${element.fontWeight} ${element.fontSize}px ${element.fontFamily}`;
        ctx.fillStyle = element.color;
        ctx.textAlign = element.textAlign;
        ctx.textBaseline = 'top';
        const x = element.textAlign === 'center' ? element.transform.width / 2 : 0;
        ctx.fillText(element.content, x, 0);
      } else if (element.type === 'qr') {
        // QR codes are rendered async, skip for now
      } else if (element.type === 'rectangle') {
        ctx.fillStyle = element.fillColor;
        if (element.cornerRadius && element.cornerRadius > 0) {
          const r = element.cornerRadius;
          const w = element.transform.width;
          const h = element.transform.height;
          ctx.beginPath();
          ctx.moveTo(r, 0);
          ctx.lineTo(w - r, 0);
          ctx.quadraticCurveTo(w, 0, w, r);
          ctx.lineTo(w, h - r);
          ctx.quadraticCurveTo(w, h, w - r, h);
          ctx.lineTo(r, h);
          ctx.quadraticCurveTo(0, h, 0, h - r);
          ctx.lineTo(0, r);
          ctx.quadraticCurveTo(0, 0, r, 0);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.fillRect(0, 0, element.transform.width, element.transform.height);
        }
        if (element.strokeWidth > 0) {
          ctx.strokeStyle = element.strokeColor;
          ctx.lineWidth = element.strokeWidth;
          ctx.strokeRect(0, 0, element.transform.width, element.transform.height);
        }
      } else if (element.type === 'ellipse') {
        ctx.fillStyle = element.fillColor;
        ctx.beginPath();
        ctx.ellipse(
          element.transform.width / 2,
          element.transform.height / 2,
          element.transform.width / 2,
          element.transform.height / 2,
          0,
          0,
          Math.PI * 2
        );
        ctx.fill();
        if (element.strokeWidth > 0) {
          ctx.strokeStyle = element.strokeColor;
          ctx.lineWidth = element.strokeWidth;
          ctx.stroke();
        }
      } else if (element.type === 'triangle') {
        ctx.fillStyle = element.fillColor;
        ctx.beginPath();
        ctx.moveTo(element.transform.width / 2, 0);
        ctx.lineTo(element.transform.width, element.transform.height);
        ctx.lineTo(0, element.transform.height);
        ctx.closePath();
        ctx.fill();
        if (element.strokeWidth > 0) {
          ctx.strokeStyle = element.strokeColor;
          ctx.lineWidth = element.strokeWidth;
          ctx.stroke();
        }
      }

      // Draw selection outline
      if (canvas.selectedElementIds.includes(element.id)) {
        ctx.strokeStyle = 'var(--color-accent)';
        ctx.lineWidth = 2 / canvas.zoom;
        ctx.strokeRect(-2, -2, element.transform.width + 4, element.transform.height + 4);
      }

      ctx.restore();
    });
  }, [elements, assets, canvas, editor]);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const { x, y } = screenToCanvas(e.clientX, e.clientY, rect, canvas.zoom, canvas.panX, canvas.panY);

    // Find clicked element (reverse order for top-to-bottom)
    let clicked = false;
    for (let i = elements.length - 1; i >= 0; i--) {
      const el = elements[i];
      if (
        x >= el.transform.x &&
        x <= el.transform.x + el.transform.width &&
        y >= el.transform.y &&
        y <= el.transform.y + el.transform.height
      ) {
        selectElement(el.id, e.shiftKey);
        clicked = true;
        break;
      }
    }

    if (!clicked) {
      clearSelection();
    }
  };

  const handleDrop = (e: React.DragEvent) => {
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
      endTime: useStore.getState().timeline.playheadPosition + (asset.type === 'video' ? asset.duration : 5),
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div
      ref={containerRef}
      className="canvas-area canvas-container"
      onClick={handleCanvasClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          margin: 'auto',
          boxShadow: 'var(--shadow-lg)',
        }}
      />
    </div>
  );
}
