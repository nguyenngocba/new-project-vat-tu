import { Bell, User, Search, Menu } from 'lucide-react';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

interface TopbarProps {
  onMenuClick?: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  return (
    <header className="bg-bg-secondary/80 backdrop-blur-sm border-b border-border h-14 flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-bg-tertiary rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5 text-text-primary" />
        </button>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm nhanh... (Ctrl+K)"
            className="w-full bg-bg-tertiary border border-border rounded-lg pl-9 pr-4 py-1.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <ThemeToggle />
        
        <button className="relative p-2 hover:bg-bg-tertiary rounded-lg transition-colors">
          <Bell size={18} className="text-text-primary" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-text-primary">Admin User</p>
            <p className="text-xs text-text-muted">Quản trị viên</p>
          </div>
          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}
