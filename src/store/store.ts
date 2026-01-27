import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  Asset,
  Element,
  TimelineState,
  CanvasState,
  EditorState,
  HistoryState,
  Tool,
  Page,
} from '../types/types';

interface StoreState {
  // Assets
  assets: Asset[];
  addAsset: (asset: Asset) => void;
  removeAsset: (id: string) => void;
  
  // Elements
  elements: Element[];
  addElement: (element: Element) => void;
  updateElement: (id: string, updates: Partial<Element>) => void;
  removeElement: (id: string) => void;
  getElementById: (id: string) => Element | undefined;
  
  // Timeline
  timeline: TimelineState;
  setPlayheadPosition: (position: number | ((prev: number) => number)) => void;
  togglePlayback: () => void;
  addPage: (page: Page) => void;
  removePage: (pageId: string) => void;
  setCurrentPage: (pageId: string) => void;
  
  // Canvas
  canvas: CanvasState;
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  selectElement: (id: string, multi?: boolean) => void;
  clearSelection: () => void;
  setHoveredElement: (id: string | null) => void;
  
  // Editor
  editor: EditorState;
  setTool: (tool: Tool) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setProjectName: (name: string) => void;
  
  // History
  history: HistoryState;
  undo: () => void;
  redo: () => void;
  saveHistory: () => void;
}

const createDefaultTimeline = (): TimelineState => ({
  pages: [
    {
      id: 'page-1',
      name: 'Page 1',
      color: '#FF6B35',
      duration: 10,
    },
  ],
  layers: [
    {
      id: 'layer-video',
      name: 'Video/Image',
      type: 'video',
      elements: [],
      locked: false,
      visible: true,
    },
    {
      id: 'layer-audio',
      name: 'Audio',
      type: 'audio',
      elements: [],
      locked: false,
      visible: true,
    },
  ],
  currentPageId: 'page-1',
  playheadPosition: 0,
  duration: 10,
  isPlaying: false,
  zoom: 1,
});

const createDefaultCanvas = (): CanvasState => ({
  zoom: 1,
  panX: 0,
  panY: 0,
  selectedElementIds: [],
  hoveredElementId: null,
  showGrid: false,
  showRulers: true,
  snapToGrid: true,
});

const createDefaultEditor = (): EditorState => ({
  projectName: `Template ${new Date().toISOString().split('T')[0]}`,
  currentTool: 'select',
  theme: 'light',
  canvasWidth: 1920,
  canvasHeight: 1080,
  fps: 30,
});

const createDefaultHistory = (): HistoryState => ({
  past: [],
  future: [],
  maxHistorySize: 50,
});

export const useStore = create<StoreState>()(
  devtools(
    (set, get) => ({
      // Assets
      assets: [],
      addAsset: (asset) => set((state) => ({ assets: [...state.assets, asset] })),
      removeAsset: (id) => set((state) => ({ assets: state.assets.filter((a) => a.id !== id) })),
      
      // Elements
      elements: [],
      addElement: (element) => {
        set((state) => ({ elements: [...state.elements, element] }));
        get().saveHistory();
      },
      updateElement: (id, updates) => {
        set((state) => ({
          elements: state.elements.map((el) =>
            el.id === id ? ({ ...el, ...updates } as Element) : el
          ),
        }));
        get().saveHistory();
      },
      removeElement: (id) => {
        set((state) => ({ elements: state.elements.filter((el) => el.id !== id) }));
        get().saveHistory();
      },
      getElementById: (id) => get().elements.find((el) => el.id === id),
      
      // Timeline
      timeline: createDefaultTimeline(),
      setPlayheadPosition: (position) =>
        set((state) => ({
          timeline: {
            ...state.timeline,
            playheadPosition: typeof position === 'function' ? position(state.timeline.playheadPosition) : position,
          },
        })),
      togglePlayback: () =>
        set((state) => ({
          timeline: { ...state.timeline, isPlaying: !state.timeline.isPlaying },
        })),
      addPage: (page: Page) => {
        const timeline = get().timeline;
        set({
          timeline: {
            ...timeline,
            pages: [...timeline.pages, page],
            currentPageId: page.id,
          },
        });
      },
      removePage: (pageId: string) => {
        const timeline = get().timeline;
        const newPages = timeline.pages.filter((p) => p.id !== pageId);
        const newCurrentPageId = timeline.currentPageId === pageId ? newPages[0]?.id : timeline.currentPageId;
        set({
          timeline: {
            ...timeline,
            pages: newPages,
            currentPageId: newCurrentPageId,
          },
        });
      },
      setCurrentPage: (pageId: string) => set({ timeline: { ...get().timeline, currentPageId: pageId } }),
      
      // Canvas
      canvas: createDefaultCanvas(),
      setZoom: (zoom) => set((state) => ({ canvas: { ...state.canvas, zoom } })),
      setPan: (x, y) => set((state) => ({ canvas: { ...state.canvas, panX: x, panY: y } })),
      selectElement: (id, multi = false) =>
        set((state) => ({
          canvas: {
            ...state.canvas,
            selectedElementIds: multi
              ? [...state.canvas.selectedElementIds, id]
              : [id],
          },
        })),
      clearSelection: () =>
        set((state) => ({
          canvas: { ...state.canvas, selectedElementIds: [] },
        })),
      setHoveredElement: (id) =>
        set((state) => ({
          canvas: { ...state.canvas, hoveredElementId: id },
        })),
      
      // Editor
      editor: createDefaultEditor(),
      setTool: (tool) => set((state) => ({ editor: { ...state.editor, currentTool: tool } })),
      setTheme: (theme) => set((state) => ({ editor: { ...state.editor, theme } })),
      setProjectName: (name) => set((state) => ({ editor: { ...state.editor, projectName: name } })),
      
      // History
      history: createDefaultHistory(),
      saveHistory: () => {
        const state = get();
        const snapshot = JSON.stringify({
          elements: state.elements,
          timeline: state.timeline,
        });
        
        set((state) => ({
          history: {
            ...state.history,
            past: [...state.history.past.slice(-state.history.maxHistorySize + 1), snapshot],
            future: [],
          },
        }));
      },
      undo: () => {
        const { history } = get();
        if (history.past.length === 0) return;
        
        const previous = history.past[history.past.length - 1];
        const current = JSON.stringify({
          elements: get().elements,
          timeline: get().timeline,
        });
        
        const restored = JSON.parse(previous);
        
        set((state) => ({
          elements: restored.elements,
          timeline: restored.timeline,
          history: {
            ...state.history,
            past: state.history.past.slice(0, -1),
            future: [current, ...state.history.future],
          },
        }));
      },
      redo: () => {
        const { history } = get();
        if (history.future.length === 0) return;
        
        const next = history.future[0];
        const current = JSON.stringify({
          elements: get().elements,
          timeline: get().timeline,
        });
        
        const restored = JSON.parse(next);
        
        set((state) => ({
          elements: restored.elements,
          timeline: restored.timeline,
          history: {
            ...state.history,
            past: [...state.history.past, current],
            future: state.history.future.slice(1),
          },
        }));
      },
    }),
    { name: 'VideoEditorStore' }
  )
);
