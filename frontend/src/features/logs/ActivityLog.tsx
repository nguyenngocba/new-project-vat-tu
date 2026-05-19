import { useState, useEffect } from 'react';
import { Clock, User, Package, TrendingUp, ArrowLeftRight, Download } from 'lucide-react';
import { formatDateTime } from '@/lib/utils/cn';

interface LogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
}

export function ActivityLog() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Simulate fetching logs from API
    setTimeout(() => {
      const mockLogs: LogEntry[] = [
        { id: '1', timestamp: new Date().toISOString(), userId: '1', userName: 'Admin', action: 'Nhập kho', details: 'Thép hình H200x200x8x12 - SL: 25 tấn' },
        { id: '2', timestamp: new Date(Date.now() - 3600000).toISOString(), userId: '1', userName: 'Admin', action: 'Xuất kho', details: 'I Beam 150x150 - SL: 15 tấn cho dự án Nhà máy A' },
        { id: '3', timestamp: new Date(Date.now() - 7200000).toISOString(), userId: '1', userName: 'Admin', action: 'Thêm vật tư', details: 'Thêm mới vật tư: H Beam 200x200' },
        { id: '4', timestamp: new Date(Date.now() - 86400000).toISOString(), userId: '1', userName: 'Admin', action: 'Sản xuất', details: 'Sản xuất cấu kiện Cột chính - SL: 10 cái' },
        { id: '5', timestamp: new Date(Date.now() - 172800000).toISOString(), userId: '1', userName: 'Admin', action: 'Xuất cấu kiện', details: 'Xuất cấu kiện Dầm phụ cho dự án Cầu đường B' },
      ];
      setLogs(mockLogs);
      setLoading(false);
    }, 500);
  }, []);

  const getActionIcon = (action: string) => {
    if (action === 'Nhập kho') return <Package className="w-4 h-4 text-success" />;
    if (action === 'Xuất kho') return <TrendingUp className="w-4 h-4 text-warning" />;
    if (action === 'Chuyển kho') return <ArrowLeftRight className="w-4 h-4 text-info" />;
    if (action === 'Sản xuất') return <Package className="w-4 h-4 text-accent" />;
    if (action === 'Xuất cấu kiện') return <TrendingUp className="w-4 h-4 text-warning" />;
    return <Clock className="w-4 h-4 text-text-muted" />;
  };

  const filteredLogs = filter === 'all' ? logs : logs.filter(log => log.action === filter);
  const actions = ['all', 'Nhập kho', 'Xuất kho', 'Sản xuất', 'Xuất cấu kiện', 'Thêm vật tư'];

  if (loading) {
    return (
      <div className="bg-bg-secondary border border-border rounded-xl p-6">
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-bg-tertiary rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-secondary border border-border rounded-xl">
      <div className="p-4 border-b border-border flex justify-between items-center flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-accent" />
          <h3 className="font-semibold text-text-primary">Nhật ký hoạt động</h3>
        </div>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1.5 text-sm bg-bg-tertiary border border-border rounded-lg"
          >
            {actions.map((act) => (
              <option key={act} value={act}>
                {act === 'all' ? 'Tất cả' : act}
              </option>
            ))}
          </select>
          <button className="p-1.5 bg-bg-tertiary rounded-lg hover:bg-bg-tertiary/80">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-text-muted">Không có hoạt động nào</div>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} className="p-4 hover:bg-bg-tertiary/50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getActionIcon(log.action)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-text-primary">{log.userName}</span>
                    <span className="text-text-secondary">•</span>
                    <span className="text-sm text-accent">{log.action}</span>
                  </div>
                  <p className="text-sm text-text-muted mt-1">{log.details}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-text-muted">
                    <User className="w-3 h-3" />
                    <span>{log.userName}</span>
                    <span>•</span>
                    <span>{formatDateTime(log.timestamp)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
