import { useEffect, useRef, useState } from 'react';
import { YardCell } from '@/types/yard.types';

interface YardCanvasProps {
  cells: YardCell[];
  onCellClick: (cell: YardCell) => void;
  selectedCell?: YardCell | null;
}

export function YardCanvas({ cells, onCellClick, selectedCell }: YardCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredCell, setHoveredCell] = useState<YardCell | null>(null);

  const zones = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
  const rows = 50;
  const cols = zones.length;

  const getCellColor = (cell: YardCell) => {
    if (selectedCell?.id === cell.id) return 'rgba(59, 130, 246, 0.8)';
    if (hoveredCell?.id === cell.id) return 'rgba(59, 130, 246, 0.4)';
    if (cell.status === 'warning') return 'rgba(239, 68, 68, 0.5)';
    if (cell.isOccupied) return 'rgba(34, 197, 94, 0.5)';
    if (cell.status === 'reserved') return 'rgba(245, 158, 11, 0.5)';
    return 'rgba(30, 41, 59, 0.3)';
  };

  const getBorderColor = (cell: YardCell) => {
    if (selectedCell?.id === cell.id) return '#3b82f6';
    if (hoveredCell?.id === cell.id) return '#60a5fa';
    if (cell.status === 'warning') return '#ef4444';
    if (cell.isOccupied) return '#22c55e';
    return '#334155';
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const container = canvas.parentElement;
    if (!container) return;

    const width = Math.min(container.clientWidth - 40, 1200);
    const height = 600;
    canvas.width = width;
    canvas.height = height;

    const cellWidth = width / cols;
    const cellHeight = height / rows;

    ctx.clearRect(0, 0, width, height);

    // Draw cells
    cells.forEach((cell) => {
      const x = (cell.col - 1) * cellWidth;
      const y = (cell.row - 1) * cellHeight;

      // Fill
      ctx.fillStyle = getCellColor(cell);
      ctx.fillRect(x, y, cellWidth - 1, cellHeight - 1);

      // Border
      ctx.strokeStyle = getBorderColor(cell);
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, cellWidth - 1, cellHeight - 1);

      // Draw text for occupied cells
      if (cell.isOccupied && cellWidth > 30 && cellHeight > 20) {
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.min(12, cellWidth / 6)}px system-ui`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
          cell.structure?.quantity?.toString() || '1',
          x + cellWidth / 2,
          y + cellHeight / 2
        );
      }
    });

    // Draw zone labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px system-ui';
    ctx.textAlign = 'center';
    zones.forEach((zone, idx) => {
      const x = idx * cellWidth + cellWidth / 2;
      ctx.fillText(zone, x, 20);
    });

    // Draw row numbers
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px system-ui';
    ctx.textAlign = 'right';
    for (let i = 1; i <= rows; i += 5) {
      const y = (i - 1) * cellHeight + cellHeight / 2;
      ctx.fillText(i.toString(), 30, y);
    }
  }, [cells, selectedCell, hoveredCell]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const cellWidth = width / cols;
    const cellHeight = height / rows;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const col = Math.floor(x / cellWidth) + 1;
    const row = Math.floor(y / cellHeight) + 1;

    if (col >= 1 && col <= cols && row >= 1 && row <= rows) {
      const cell = cells.find((c) => c.col === col && c.row === row);
      setHoveredCell(cell || null);
    } else {
      setHoveredCell(null);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const cellWidth = width / cols;
    const cellHeight = height / rows;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const col = Math.floor(x / cellWidth) + 1;
    const row = Math.floor(y / cellHeight) + 1;

    if (col >= 1 && col <= cols && row >= 1 && row <= rows) {
      const cell = cells.find((c) => c.col === col && c.row === row);
      if (cell) onCellClick(cell);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      onMouseLeave={() => setHoveredCell(null)}
      className="w-full cursor-pointer rounded-lg border border-border bg-bg-tertiary"
      style={{ height: '600px' }}
    />
  );
}
