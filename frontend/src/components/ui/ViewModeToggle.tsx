import { LayoutGrid, List, Square } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export type ViewMode = 'grid' | 'list' | 'compact';

interface ViewModeToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export function ViewModeToggle({ mode, onChange }: ViewModeToggleProps) {
  const modes = [
    { value: 'compact' as const, icon: Square, label: 'Nhỏ' },
    { value: 'grid' as const, icon: LayoutGrid, label: 'Lưới' },
    { value: 'list' as const, icon: List, label: 'Danh sách' },
  ];

  return (
    <div className="flex gap-1 bg-bg-tertiary rounded-lg p-1">
      {modes.map((m) => (
        <button
          key={m.value}
          onClick={() => onChange(m.value)}
          className={cn(
            "p-2 rounded-md transition-colors",
            mode === m.value ? "bg-accent text-white" : "text-text-muted hover:text-text-primary"
          )}
          title={m.label}
        >
          <m.icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
}
