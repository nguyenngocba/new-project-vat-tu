import { LucideIcon } from 'lucide-react';
import { Card } from './Card';
import { cn } from '@/utils/cn';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  suffix?: string;
}

export function StatCard({ title, value, icon: Icon, color = 'text-steel-500', suffix = '' }: StatCardProps) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-dark-400 text-sm">{title}</p>
          <p className="text-2xl font-bold mt-1">
            {value}{suffix && <span className="text-sm text-dark-400 ml-1">{suffix}</span>}
          </p>
        </div>
        <div className={cn('p-3 rounded-lg bg-current/10', color)}>
          <Icon className={cn('w-6 h-6', color)} />
        </div>
      </div>
    </Card>
  );
}
