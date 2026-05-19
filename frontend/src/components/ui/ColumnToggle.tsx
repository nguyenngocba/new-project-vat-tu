import { useState } from 'react';
import { Settings, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface Column {
  key: string;
  label: string;
  visible: boolean;
}

interface ColumnToggleProps {
  columns: Column[];
  onToggle: (columnKey: string) => void;
}

export function ColumnToggle({ columns, onToggle }: ColumnToggleProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 bg-bg-tertiary rounded-lg hover:bg-bg-tertiary/80 transition-colors"
        title="Chọn cột hiển thị"
      >
        <Settings className="w-4 h-4" />
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 bg-bg-secondary border border-border rounded-lg shadow-lg z-10">
            <div className="p-2 border-b border-border">
              <span className="text-sm font-medium">Chọn cột hiển thị</span>
            </div>
            <div className="p-2 space-y-1">
              {columns.map((col) => (
                <button
                  key={col.key}
                  onClick={() => onToggle(col.key)}
                  className="w-full flex items-center justify-between p-2 rounded hover:bg-bg-tertiary transition-colors"
                >
                  <span className="text-sm">{col.label}</span>
                  {col.visible ? (
                    <Eye className="w-4 h-4 text-accent" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-text-muted" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
