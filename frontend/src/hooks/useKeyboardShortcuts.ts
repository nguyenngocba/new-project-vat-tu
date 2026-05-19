import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useKeyboardShortcuts(shortcuts: Array<{
  keys: string[];
  handler: (e: KeyboardEvent) => void;
  preventDefault?: boolean;
}>) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const ctrl = e.ctrlKey || e.metaKey;
      const alt = e.altKey;
      const shift = e.shiftKey;
      
      for (const shortcut of shortcuts) {
        const match = shortcut.keys.some(k => {
          const parts = k.toLowerCase().split('+');
          const hasCtrl = parts.includes('ctrl');
          const hasAlt = parts.includes('alt');
          const hasShift = parts.includes('shift');
          const mainKey = parts[parts.length - 1];
          
          return (hasCtrl === ctrl) && (hasAlt === alt) && (hasShift === shift) && (mainKey === key);
        });
        
        if (match) {
          if (shortcut.preventDefault) e.preventDefault();
          shortcut.handler(e);
          break;
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

export function useGlobalShortcuts(setIsCommandPaletteOpen: (open: boolean) => void) {
  const navigate = useNavigate();
  
  useKeyboardShortcuts([
    { keys: ['ctrl+k', 'cmd+k'], handler: () => setIsCommandPaletteOpen(true), preventDefault: true },
    { keys: ['alt+m'], handler: () => navigate('/inventory'), preventDefault: true },
    { keys: ['alt+d'], handler: () => navigate('/dashboard'), preventDefault: true },
    { keys: ['alt+p'], handler: () => navigate('/projects'), preventDefault: true },
    { keys: ['alt+c'], handler: () => navigate('/structures'), preventDefault: true },
    { keys: ['alt+y'], handler: () => navigate('/yard'), preventDefault: true },
    { keys: ['alt+s'], handler: () => navigate('/suppliers'), preventDefault: true },
    { keys: ['alt+t'], handler: () => navigate('/settings'), preventDefault: true },
  ]);
}
