/**
 * Format seconds to MM:SS format
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format seconds to HH:MM:SS format
 */
export function formatTimeLong(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Parse time string (MM:SS or HH:MM:SS) to seconds
 */
export function parseTime(timeString: string): number {
  const parts = timeString.split(':').map(Number);
  
  if (parts.length === 2) {
    const [mins, secs] = parts;
    return mins * 60 + secs;
  } else if (parts.length === 3) {
    const [hours, mins, secs] = parts;
    return hours * 3600 + mins * 60 + secs;
  }
  
  return 0;
}

/**
 * Convert timeline position (pixels) to time (seconds)
 */
export function pixelsToTime(pixels: number, zoom: number, pixelsPerSecond: number): number {
  return pixels / (zoom * pixelsPerSecond);
}

/**
 * Convert time (seconds) to timeline position (pixels)
 */
export function timeToPixels(time: number, zoom: number, pixelsPerSecond: number): number {
  return time * zoom * pixelsPerSecond;
}

/**
 * Calculate frame number from time
 */
export function timeToFrame(time: number, fps: number): number {
  return Math.floor(time * fps);
}

/**
 * Calculate time from frame number
 */
export function frameToTime(frame: number, fps: number): number {
  return frame / fps;
}
