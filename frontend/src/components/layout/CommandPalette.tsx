import { useState, useEffect, useCallback } from 'react';
import { Search, Package, Building2, Box, Map, Truck, Settings, LayoutDashboard, Plus, ArrowLeftRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils/cn';

interface CommandItem {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action: () => void;
  shortcut?: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const commands: CommandItem[] = [
    // Navigation
    { id: 'nav-dashboard', title: 'Dashboard', description: 'Xem tổng quan hệ thống', icon: <LayoutDashboard className="w-4 h-4" />, action: () => navigate('/dashboard'), shortcut: 'G D' },
    { id: 'nav-inventory', title: 'Kho vật tư', description: 'Quản lý vật tư, nhập xuất tồn kho', icon: <Package className="w-4 h-4" />, action: () => navigate('/inventory'), shortcut: 'G I' },
    { id: 'nav-projects', title: 'Dự án', description: 'Quản lý dự án, theo dõi ngân sách', icon: <Building2 className="w-4 h-4" />, action: () => navigate('/projects'), shortcut: 'G P' },
    { id: 'nav-structures', title: 'Cấu kiện', description: 'Quản lý cấu kiện, BOM, sản xuất', icon: <Box className="w-4 h-4" />, action: () => navigate('/structures'), shortcut: 'G C' },
    { id: 'nav-yard', title: 'Sân bãi', description: 'Sơ đồ sân bãi, vị trí cấu kiện', icon: <Map className="w-4 h-4" />, action: () => navigate('/yard'), shortcut: 'G Y' },
    { id: 'nav-suppliers', title: 'Nhà cung cấp', description: 'Quản lý nhà cung cấp', icon: <Truck className="w-4 h-4" />, action: () => navigate('/suppliers'), shortcut: 'G S' },
    { id: 'nav-settings', title: 'Cài đặt', description: 'Cấu hình hệ thống', icon: <Settings className="w-4 h-4" />, action: () => navigate('/settings'), shortcut: 'G T' },
    
    // Actions
    { id: 'action-purchase', title: 'Nhập kho', description: 'Thêm phiếu nhập kho mới', icon: <Plus className="w-4 h-4" />, action: () => { window.location.href = '/inventory?action=purchase'; onClose(); }, shortcut: 'N P' },
    { id: 'action-usage', title: 'Xuất kho', description: 'Thêm phiếu xuất kho mới', icon: <ArrowLeftRight className="w-4 h-4" />, action: () => { window.location.href = '/inventory?action=usage'; onClose(); }, shortcut: 'N U' },
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.description?.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
            onClose();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-xl">
        <div className="bg-bg-secondary border border-border rounded-xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-3 p-4 border-b border-border">
            <Search className="w-5 h-5 text-text-muted" />
            <input
              type="text"
              placeholder="Tìm kiếm lệnh..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-text-primary placeholder-text-muted"
              autoFocus
            />
            <kbd className="px-2 py-1 text-xs bg-bg-tertiary rounded text-text-muted">ESC</kbd>
          </div>
          
          <div className="max-h-[400px] overflow-y-auto p-2">
            {filteredCommands.length === 0 ? (
              <div className="p-8 text-center text-text-muted">Không tìm thấy lệnh</div>
            ) : (
              filteredCommands.map((cmd, idx) => (
                <button
                  key={cmd.id}
                  onClick={() => { cmd.action(); onClose(); }}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left",
                    idx === selectedIndex ? "bg-accent/10" : "hover:bg-bg-tertiary"
                  )}
                >
                  <div className="text-accent">{cmd.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium text-text-primary">{cmd.title}</div>
                    {cmd.description && (
                      <div className="text-sm text-text-muted">{cmd.description}</div>
                    )}
                  </div>
                  {cmd.shortcut && (
                    <kbd className="px-2 py-1 text-xs bg-bg-tertiary rounded text-text-muted">
                      {cmd.shortcut}
                    </kbd>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
