import { useEffect } from 'react';
import { EditorLayout } from './components/layout/EditorLayout';
import { useStore } from './store/store';

function App() {
  const { undo, redo, editor } = useStore();

  useEffect(() => {
    // Set initial theme
    document.documentElement.setAttribute('data-theme', editor.theme);

    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Z') {
        e.preventDefault();
        redo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        undo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, editor.theme]);

  return <EditorLayout />;
}

export default App;
