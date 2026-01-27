import { Upload, Layers, Radio } from 'lucide-react';
import { useState } from 'react';

interface LeftSidebarProps {
  onPanelChange: (panel: 'upload' | 'elements' | 'live' | null) => void;
  activePanel: string | null;
}

export function LeftSidebar({ onPanelChange, activePanel }: LeftSidebarProps) {
  const buttons = [
    { id: 'upload', icon: Upload, label: 'Upload' },
    { id: 'elements', icon: Layers, label: 'Elements' },
    { id: 'live', icon: Radio, label: 'Live' },
  ] as const;

  return (
    <div
      className="left-sidebar panel flex flex-col items-center gap-sm"
      style={{ padding: 'var(--spacing-md) 0' }}
    >
      {buttons.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          className={`btn-icon ${activePanel === id ? 'active' : ''}`}
          onClick={() => onPanelChange(activePanel === id ? null : id)}
          title={label}
        >
          <Icon size={20} />
        </button>
      ))}
    </div>
  );
}
