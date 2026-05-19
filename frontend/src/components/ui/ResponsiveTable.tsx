import { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface ResponsiveTableProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveTable({ children, className }: ResponsiveTableProps) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <div className="min-w-full align-middle">
        {children}
      </div>
    </div>
  );
}

export function MobileCard({ children, onClick, className }: { children: ReactNode; onClick?: () => void; className?: string }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "block sm:hidden bg-bg-secondary border border-border rounded-lg p-4 mb-3 cursor-pointer hover:border-accent/50 transition-all",
        className
      )}
    >
      {children}
    </div>
  );
}

export function DesktopOnly({ children }: { children: ReactNode }) {
  return <div className="hidden sm:block">{children}</div>;
}

export function MobileOnly({ children }: { children: ReactNode }) {
  return <div className="block sm:hidden">{children}</div>;
}
