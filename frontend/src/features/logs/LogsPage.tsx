import { ActivityLog } from './ActivityLog';

export function LogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Nhật ký hệ thống</h1>
        <p className="text-text-secondary mt-1">Theo dõi tất cả hoạt động trong hệ thống</p>
      </div>
      
      <ActivityLog />
    </div>
  );
}
