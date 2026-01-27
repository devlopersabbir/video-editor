import { Play, Music } from 'lucide-react';
import type { Asset } from '../../types/types';
import { useStore } from '../../store/store';
import type { ImageElement, VideoElement } from '../../types/types';

interface AssetGridProps {
  assets: Asset[];
}

export function AssetGrid({ assets }: AssetGridProps) {
  const { addElement, timeline, editor } = useStore();

  const handleDragStart = (e: React.DragEvent, asset: Asset) => {
    e.dataTransfer.setData('assetId', asset.id);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDoubleClick = (asset: Asset) => {
    if (asset.type === 'image' || asset.type === 'video') {
      const element: ImageElement | VideoElement = {
        id: `element-${Date.now()}`,
        type: asset.type,
        name: asset.name,
        assetId: asset.id,
        transform: {
          x: editor.canvasWidth / 2 - 200,
          y: editor.canvasHeight / 2 - 150,
          width: 400,
          height: 300,
          rotation: 0,
          scaleX: 1,
          scaleY: 1,
        },
        startTime: timeline.playheadPosition,
        endTime: timeline.playheadPosition + (asset.type === 'video' ? asset.duration : 5),
        layerId: 'layer-video',
        pageId: timeline.currentPageId,
        freePosition: true,
        locked: false,
        visible: true,
        opacity: 1,
        ...(asset.type === 'video' && { volume: 1 }),
      };
      addElement(element);
    }
  };

  return (
    <div className="asset-grid">
      {assets.map((asset) => (
        <div
          key={asset.id}
          className="asset-item"
          draggable
          onDragStart={(e) => handleDragStart(e, asset)}
          onDoubleClick={() => handleDoubleClick(asset)}
        >
          {asset.thumbnail ? (
            <img src={asset.thumbnail} alt={asset.name} className="asset-thumbnail" />
          ) : (
            <div
              className="asset-thumbnail flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-bg-tertiary)' }}
            >
              {asset.type === 'video' && <Play size={32} style={{ color: 'var(--color-text-secondary)' }} />}
              {asset.type === 'audio' && <Music size={32} style={{ color: 'var(--color-text-secondary)' }} />}
            </div>
          )}
          
          <div className="asset-overlay">
            <div className="truncate">{asset.name}</div>
            {(asset.type === 'video' || asset.type === 'audio') && asset.duration && (
              <div className="text-xs" style={{ opacity: 0.8 }}>
                {Math.floor(asset.duration / 60)}:{Math.floor(asset.duration % 60).toString().padStart(2, '0')}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
