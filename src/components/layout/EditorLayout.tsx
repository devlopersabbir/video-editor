import { useState } from 'react';
import { TopNav } from './TopNav';
import { LeftSidebar } from './LeftSidebar';
import { AssetPanel } from '../assets/AssetPanel';
import { ElementsPanel } from '../elements/ElementsPanel';
import { CanvasSVG } from '../canvas/CanvasSVG';
import { PropertiesPanelFigma } from '../properties/PropertiesPanelFigma';
import '../properties/PropertiesPanelFigma.css';
import { TimelineFigma } from '../timeline/TimelineFigma';
import '../timeline/TimelineFigma.css';

export function EditorLayout() {
  const [activePanel, setActivePanel] = useState<'upload' | 'elements' | 'live' | null>('upload');

  return (
    <div className="editor-layout">
      <TopNav />
      <LeftSidebar onPanelChange={setActivePanel} activePanel={activePanel} />
      
      {activePanel === 'upload' && <AssetPanel />}
      {activePanel === 'elements' && <ElementsPanel />}
      {activePanel === 'live' && (
        <div className="panel" style={{ gridArea: 'assets' }}>
          <div className="panel-header">Live</div>
          <div className="panel-content">
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Live preview feature coming soon...
            </p>
          </div>
        </div>
      )}
      {!activePanel && <div style={{ gridArea: 'assets' }} />}
      
      <CanvasSVG />
      <PropertiesPanelFigma />
      <TimelineFigma />
    </div>
  );
}
