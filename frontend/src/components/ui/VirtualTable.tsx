import { useRef, useState, useEffect, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface VirtualTableProps<T> {
  data: T[];
  rowHeight: number;
  renderRow: (item: T, index: number) => ReactNode;
  containerHeight?: number;
  overscan?: number;
  className?: string;
}

export function VirtualTable<T>({
  data,
  rowHeight,
  renderRow,
  containerHeight = 500,
  overscan = 5,
  className,
}: VirtualTableProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const totalHeight = data.length * rowHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const endIndex = Math.min(
    data.length,
    Math.ceil((scrollTop + containerHeight) / rowHeight) + overscan
  );
  
  const visibleData = data.slice(startIndex, endIndex);
  const offsetY = startIndex * rowHeight;
  
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };
  
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-text-muted">
        Không có dữ liệu
      </div>
    );
  }
  
  return (
    <div
      ref={containerRef}
      className={cn("overflow-auto", className)}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ position: 'absolute', top: offsetY, left: 0, right: 0 }}>
          {visibleData.map((item, idx) => renderRow(item, startIndex + idx))}
        </div>
      </div>
    </div>
  );
}
