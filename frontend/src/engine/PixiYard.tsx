import { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import { YardCell } from '@/types/yard.types';

interface PixiYardProps {
  cells: YardCell[];
  onCellClick: (cell: YardCell) => void;
  selectedCell?: YardCell | null;
}

export function PixiYard({ cells, onCellClick, selectedCell }: PixiYardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const viewportRef = useRef<Viewport | null>(null);

  const zones = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
  const rows = 50;
  const cols = zones.length;

  useEffect(() => {
    if (!containerRef.current) return;

    // Create Pixi application
    const app = new PIXI.Application({
      width: containerRef.current.clientWidth,
      height: 600,
      backgroundColor: 0x0a0f14,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
    });
    
    containerRef.current.appendChild(app.view as unknown as Node);
    appRef.current = app;

    // Create viewport for pan/zoom
    const viewport = new Viewport({
      screenWidth: app.screen.width,
      screenHeight: app.screen.height,
      worldWidth: cols * 60,
      worldHeight: rows * 60,
      events: app.renderer.events,
    });
    
    app.stage.addChild(viewport);
    viewport
      .drag()
      .pinch()
      .wheel()
      .decelerate();
    
    viewportRef.current = viewport;

    // Draw grid
    const graphics = new PIXI.Graphics();
    
    // Draw cells
    cells.forEach((cell) => {
      const x = (cell.col - 1) * 60;
      const y = (cell.row - 1) * 60;
      const width = 58;
      const height = 58;
      
      // Fill color based on status
      let color = 0x1e293b;
      if (selectedCell?.id === cell.id) color = 0x3b82f6;
      else if (cell.status === 'warning') color = 0xef4444;
      else if (cell.isOccupied) color = 0x22c55e;
      else if (cell.status === 'reserved') color = 0xf59e0b;
      
      graphics.beginFill(color, 0.5);
      graphics.lineStyle(1, 0x334155, 1);
      graphics.drawRect(x, y, width, height);
      graphics.endFill();
      
      // Draw text for occupied cells
      if (cell.isOccupied && cell.structure) {
        const text = new PIXI.Text(cell.structure.quantity.toString(), {
          fontSize: 12,
          fill: 0xffffff,
          fontWeight: 'bold',
        });
        text.x = x + width / 2 - text.width / 2;
        text.y = y + height / 2 - text.height / 2;
        viewport.addChild(text);
      }
    });
    
    viewport.addChild(graphics);
    
    // Add interactivity
    viewport.interactive = true;
    viewport.on('click', (event) => {
      const position = viewport.toWorld(event.global);
      const col = Math.floor(position.x / 60) + 1;
      const row = Math.floor(position.y / 60) + 1;
      
      if (col >= 1 && col <= cols && row >= 1 && row <= rows) {
        const cell = cells.find(c => c.col === col && c.row === row);
        if (cell) onCellClick(cell);
      }
    });

    // Draw labels
    const labelStyle = { fontSize: 14, fill: 0x94a3b8 };
    
    // Zone labels
    zones.forEach((zone, idx) => {
      const text = new PIXI.Text(zone, labelStyle);
      text.x = idx * 60 + 30 - text.width / 2;
      text.y = -20;
      viewport.addChild(text);
    });
    
    // Row labels
    for (let i = 1; i <= rows; i += 5) {
      const text = new PIXI.Text(i.toString(), labelStyle);
      text.x = -25;
      text.y = (i - 1) * 60 + 30 - text.height / 2;
      viewport.addChild(text);
    }

    // Animation loop
    app.ticker.add(() => {
      // Update viewport
    });

    return () => {
      app.destroy(true, true);
    };
  }, [cells, selectedCell]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (appRef.current && containerRef.current) {
        appRef.current.renderer.resize(containerRef.current.clientWidth, 600);
        if (viewportRef.current) {
          viewportRef.current.screenWidth = containerRef.current.clientWidth;
          viewportRef.current.screenHeight = 600;
        }
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <div ref={containerRef} className="w-full h-[600px] rounded-lg overflow-hidden" />;
}
