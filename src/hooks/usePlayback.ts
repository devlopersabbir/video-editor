import { useEffect } from 'react';
import { useStore } from '../store/store';

export function usePlayback() {
  const { timeline, setPlayheadPosition, togglePlayback } = useStore();

  useEffect(() => {
    if (!timeline.isPlaying) return;

    let animationId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
      lastTime = currentTime;

      setPlayheadPosition((pos) => {
        const newPos = pos + deltaTime;
        // Loop back to start when reaching the end
        if (newPos >= timeline.duration) {
          togglePlayback(); // Stop at end
          return timeline.duration;
        }
        return newPos;
      });

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [timeline.isPlaying, timeline.duration, setPlayheadPosition, togglePlayback]);

  return null;
}
