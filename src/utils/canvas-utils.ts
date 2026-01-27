/**
 * Convert screen coordinates to canvas coordinates
 */
export function screenToCanvas(
  screenX: number,
  screenY: number,
  canvasRect: DOMRect,
  zoom: number,
  panX: number,
  panY: number
): { x: number; y: number } {
  const x = (screenX - canvasRect.left - panX) / zoom;
  const y = (screenY - canvasRect.top - panY) / zoom;
  return { x, y };
}

/**
 * Convert canvas coordinates to screen coordinates
 */
export function canvasToScreen(
  canvasX: number,
  canvasY: number,
  zoom: number,
  panX: number,
  panY: number
): { x: number; y: number } {
  const x = canvasX * zoom + panX;
  const y = canvasY * zoom + panY;
  return { x, y };
}

/**
 * Check if a point is inside a rectangle
 */
export function pointInRect(
  px: number,
  py: number,
  rx: number,
  ry: number,
  rw: number,
  rh: number
): boolean {
  return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
}

/**
 * Calculate bounding box for a transformed element
 */
export function calculateBoundingBox(
  x: number,
  y: number,
  width: number,
  height: number,
  rotation: number
): { x: number; y: number; width: number; height: number } {
  if (rotation === 0) {
    return { x, y, width, height };
  }

  const rad = (rotation * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  const corners = [
    { x: 0, y: 0 },
    { x: width, y: 0 },
    { x: width, y: height },
    { x: 0, y: height },
  ];

  const rotatedCorners = corners.map((corner) => ({
    x: x + corner.x * cos - corner.y * sin,
    y: y + corner.x * sin + corner.y * cos,
  }));

  const minX = Math.min(...rotatedCorners.map((c) => c.x));
  const minY = Math.min(...rotatedCorners.map((c) => c.y));
  const maxX = Math.max(...rotatedCorners.map((c) => c.x));
  const maxY = Math.max(...rotatedCorners.map((c) => c.y));

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

/**
 * Generate thumbnail from video element
 */
export function generateVideoThumbnail(video: HTMLVideoElement): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = 160;
    canvas.height = 90;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Failed to get canvas context'));
      return;
    }

    video.currentTime = 0;
    video.addEventListener('seeked', () => {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    }, { once: true });
  });
}

/**
 * Generate thumbnail from image element
 */
export function generateImageThumbnail(image: HTMLImageElement): string {
  const canvas = document.createElement('canvas');
  const maxSize = 160;
  const ratio = Math.min(maxSize / image.width, maxSize / image.height);
  
  canvas.width = image.width * ratio;
  canvas.height = image.height * ratio;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');
  
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.7);
}

/**
 * Load image from URL
 */
export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Load video from URL
 */
export function loadVideo(url: string): Promise<HTMLVideoElement> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.onloadedmetadata = () => resolve(video);
    video.onerror = reject;
    video.src = url;
    video.load();
  });
}

/**
 * Snap value to grid
 */
export function snapToGrid(value: number, gridSize: number): number {
  return Math.round(value / gridSize) * gridSize;
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
