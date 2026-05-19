import { useState, useRef, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface ResizablePanelProps {
  children: ReactNode;
  defaultHeight?: number;
  minHeight?: number;
  maxHeight?: number;
  className?: string;
}

export function ResizablePanel({ 
  children, 
  defaultHeight = 300, 
  minHeight = 150, 
  maxHeight = 600,
  className 
}: ResizablePanelProps) {
  const [height, setHeight] = useState(defaultHeight);
  const [isResizing, setIsResizing] = useState(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(height);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    startYRef.current = e.clientY;
    startHeightRef.current = height;
    document.body.style.cursor = 'ns-resize';
    document.body.style.userSelect = 'none';
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;
    const delta = e.clientY - startYRef.current;
    const newHeight = Math.min(maxHeight, Math.max(minHeight, startHeightRef.current + delta));
    setHeight(newHeight);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

  React.useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing]);

  return (
    <div className={cn("relative", className)} style={{ height }}>
      <div className="h-full overflow-auto">
        {children}
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 h-1 cursor-ns-resize hover:bg-accent/50 transition-colors"
        onMouseDown={handleMouseDown}
      />
    </div>
  );
}
