import { NavLink } from 'react-router-dom';
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
  History
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/inventory', icon: Package, label: 'Kho vật tư' },
  { path: '/projects', icon: Building2, label: 'Dự án' },
  { path: '/structures', icon: Box, label: 'Cấu kiện' },
  { path: '/yard', icon: Map, label: 'Sân bãi' },
  { path: '/suppliers', icon: Truck, label: 'Nhà cung cấp' },
  { path: '/logs', icon: History, label: 'Nhật ký' },
  { path: '/settings', icon: Settings, label: 'Cài đặt' },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside className={cn(
      'bg-bg-secondary border-r border-border transition-all duration-300 flex flex-col h-full',
      collapsed ? 'w-16' : 'w-64'
    )}>
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Warehouse className="w-6 h-6 text-accent" />
            <span className="font-bold text-text-primary">SteelTrack</span>
          </div>
        )}
        {collapsed && <Warehouse className="w-6 h-6 text-accent mx-auto" />}
        <button
          onClick={onToggle}
          className="p-1 hover:bg-bg-tertiary rounded-lg transition-colors"
        >
          <ChevronLeft className={cn('w-4 h-4 text-text-secondary', collapsed && 'rotate-180')} />
        </button>
      </div>
      
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
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
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
