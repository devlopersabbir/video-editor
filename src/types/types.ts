// Asset Types
export type AssetType = 'image' | 'video' | 'audio';

export interface BaseAsset {
  id: string;
  name: string;
  type: AssetType;
  url: string;
  thumbnail?: string;
  size: number;
  createdAt: number;
}

export interface ImageAsset extends BaseAsset {
  type: 'image';
  width: number;
  height: number;
}

export interface VideoAsset extends BaseAsset {
  type: 'video';
  width: number;
  height: number;
  duration: number;
}

export interface AudioAsset extends BaseAsset {
  type: 'audio';
  duration: number;
}

export type Asset = ImageAsset | VideoAsset | AudioAsset;

// Element Types
export type ElementType = 'image' | 'video' | 'text' | 'qr' | 'rectangle' | 'ellipse' | 'triangle';

export interface Transform {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
}

export interface Animation {
  type: 'none' | 'fade' | 'slide' | 'zoom';
  duration: number;
}

export interface BaseElement {
  id: string;
  type: ElementType;
  name: string;
  transform: Transform;
  startTime: number;
  endTime: number;
  layerId: string;
  pageId: string;
  freePosition: boolean;
  locked: boolean;
  visible: boolean;
  animation?: Animation;
}

export interface ImageElement extends BaseElement {
  type: 'image';
  assetId: string;
  opacity: number;
}

export interface VideoElement extends BaseElement {
  type: 'video';
  assetId: string;
  opacity: number;
  volume: number;
}

export interface TextElement extends BaseElement {
  type: 'text';
  content: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  color: string;
  textAlign: 'left' | 'center' | 'right';
}

export interface QRElement extends BaseElement {
  type: 'qr';
  data: string;
  foregroundColor: string;
  backgroundColor: string;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
}

export interface ShapeElement extends BaseElement {
  type: 'rectangle' | 'ellipse' | 'triangle';
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  cornerRadius?: number; // for rectangles
}

export type Element = ImageElement | VideoElement | TextElement | QRElement | ShapeElement;

// Timeline Types
export interface TimelineLayer {
  id: string;
  name: string;
  type: 'video' | 'audio';
  elements: string[]; // element IDs
  locked: boolean;
  visible: boolean;
}

export interface TimelinePage {
  id: string;
  name: string;
  color: string;
  duration: number;
}

export type Page = TimelinePage;

export interface TimelineState {
  pages: TimelinePage[];
  layers: TimelineLayer[];
  currentPageId: string;
  playheadPosition: number;
  duration: number;
  isPlaying: boolean;
  zoom: number;
}

// Canvas Types
export interface CanvasState {
  zoom: number;
  panX: number;
  panY: number;
  selectedElementIds: string[];
  hoveredElementId: string | null;
  showGrid: boolean;
  showRulers: boolean;
  snapToGrid: boolean;
}

// Editor Types
export type Tool = 'select' | 'text' | 'qr' | 'rectangle' | 'ellipse' | 'triangle';

export interface EditorState {
  projectName: string;
  currentTool: Tool;
  theme: 'light' | 'dark';
  canvasWidth: number;
  canvasHeight: number;
  fps: number;
}

// History Types
export interface HistoryState {
  past: string[]; // serialized states
  future: string[];
  maxHistorySize: number;
}

// Renderer Types
export type RendererType = 'webgpu' | 'canvas2d';

export interface RendererCapabilities {
  type: RendererType;
  supportsWebGPU: boolean;
  maxTextureSize: number;
}
