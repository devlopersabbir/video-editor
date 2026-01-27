import { useState, useRef } from 'react';
import { Search, Upload as UploadIcon } from 'lucide-react';
import { useStore } from '../../store/store';
import { AssetGrid } from './AssetGrid';
import type { Asset, AssetType } from '../../types/types';
import { generateImageThumbnail, generateVideoThumbnail, loadImage, loadVideo } from '../../utils/canvas-utils';

export function AssetPanel() {
  const { assets, addAsset } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | AssetType>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || asset.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = URL.createObjectURL(file);
      
      try {
        if (file.type.startsWith('image/')) {
          const img = await loadImage(url);
          const thumbnail = generateImageThumbnail(img);
          
          const asset: Asset = {
            id: `asset-${Date.now()}-${i}`,
            name: file.name,
            type: 'image',
            url,
            thumbnail,
            size: file.size,
            createdAt: Date.now(),
            width: img.width,
            height: img.height,
          };
          addAsset(asset);
        } else if (file.type.startsWith('video/')) {
          const video = await loadVideo(url);
          const thumbnail = await generateVideoThumbnail(video);
          
          const asset: Asset = {
            id: `asset-${Date.now()}-${i}`,
            name: file.name,
            type: 'video',
            url,
            thumbnail,
            size: file.size,
            createdAt: Date.now(),
            width: video.videoWidth,
            height: video.videoHeight,
            duration: video.duration,
          };
          addAsset(asset);
        } else if (file.type.startsWith('audio/')) {
          const audio = new Audio(url);
          await new Promise((resolve) => {
            audio.addEventListener('loadedmetadata', resolve, { once: true });
          });
          
          const asset: Asset = {
            id: `asset-${Date.now()}-${i}`,
            name: file.name,
            type: 'audio',
            url,
            size: file.size,
            createdAt: Date.now(),
            duration: audio.duration,
          };
          addAsset(asset);
        }
      } catch (error) {
        console.error('Failed to load asset:', error);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="asset-panel panel" onDrop={handleDrop} onDragOver={handleDragOver}>
      <div className="panel-header">
        <span>My Resource</span>
        <button
          className="btn btn-primary flex items-center gap-xs"
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadIcon size={16} />
          <span className="text-sm">Upload</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,audio/*"
          onChange={(e) => handleFileUpload(e.target.files)}
          style={{ display: 'none' }}
        />
      </div>

      <div style={{ padding: 'var(--spacing-md)' }}>
        <div className="flex items-center gap-sm" style={{ marginBottom: 'var(--spacing-md)' }}>
          <Search size={16} style={{ color: 'var(--color-text-secondary)' }} />
          <input
            type="text"
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, border: 'none', background: 'transparent' }}
          />
        </div>

        <div className="tabs">
          {(['all', 'image', 'video', 'audio'] as const).map((tab) => (
            <div
              key={tab}
              className={`tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filteredAssets.length > 0 ? (
          <AssetGrid assets={filteredAssets} />
        ) : (
          <div
            className="flex flex-col items-center justify-center"
            style={{ height: '100%', color: 'var(--color-text-secondary)' }}
          >
            <UploadIcon size={48} style={{ marginBottom: 'var(--spacing-md)', opacity: 0.5 }} />
            <p>No assets yet</p>
            <p className="text-sm">Upload or drag files here</p>
          </div>
        )}
      </div>
    </div>
  );
}
