import { Outlet, NavLink as RouterNavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Building2, 
  Box, 
  Map, 
  Truck, 
  Settings, 
  ChevronLeft, 
  Warehouse,
  Command,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { useGlobalShortcuts } from '@/hooks/useKeyboardShortcuts';
import { Topbar } from './Topbar';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/inventory', icon: Package, label: 'Kho vật tư' },
  { path: '/projects', icon: Building2, label: 'Dự án' },
  { path: '/structures', icon: Box, label: 'Cấu kiện' },
  { path: '/yard', icon: Map, label: 'Sân bãi' },
  { path: '/suppliers', icon: Truck, label: 'Nhà cung cấp' },
  { path: '/settings', icon: Settings, label: 'Cài đặt' },
];

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Global shortcuts
  useGlobalShortcuts(setIsCommandPaletteOpen);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sidebarClasses = cn(
    'bg-bg-secondary border-r border-border transition-all duration-300 flex flex-col fixed lg:relative z-50 h-full',
    collapsed ? 'w-16' : 'w-64',
    isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
  );

  return (
    <div className="flex h-screen bg-bg">
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={sidebarClasses}>
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <Warehouse className="w-6 h-6 text-accent" />
              <span className="font-bold text-text-primary">SteelTrack</span>
            </div>
          )}
          {collapsed && <Warehouse className="w-6 h-6 text-accent mx-auto" />}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:block p-1 hover:bg-bg-tertiary rounded-lg transition-colors"
            >
              <ChevronLeft className={cn('w-4 h-4 text-text-secondary', collapsed && 'rotate-180')} />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-1 hover:bg-bg-tertiary rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-text-secondary" />
            </button>
          </div>
        </div>
        
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map((item) => (
            <RouterNavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all duration-200',
                isActive 
                  ? 'bg-accent/10 text-accent border border-accent/20' 
                  : 'text-text-secondary hover:bg-bg-tertiary/50 hover:text-text-primary',
                collapsed && 'justify-center'
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5" />
              {!collapsed && <span>{item.label}</span>}
            </RouterNavLink>
          ))}
        </nav>
        
        {/* Command palette button */}
        <div className="p-4 border-t border-border">
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="w-full flex items-center gap-2 px-3 py-2 bg-bg-tertiary rounded-lg text-text-secondary hover:text-text-primary transition-colors"
          >
            <Command className="w-4 h-4" />
            {!collapsed && <span className="text-sm">Tìm kiếm lệnh...</span>}
            {!collapsed && <kbd className="ml-auto text-xs text-text-muted">⌘K</kbd>}
          </button>
        </div>
      </aside>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
      
      {/* Command Palette */}
      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)} 
      />
    </div>
  );
}
