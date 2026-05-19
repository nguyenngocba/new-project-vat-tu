import { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Ruler, Wrench, PaintBucket } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface QCInspectionProps {
  structureId: string;
  onComplete: (result: 'pass' | 'fail', notes: string) => void;
}

export function QCInspection({ structureId, onComplete }: QCInspectionProps) {
  const [checks, setChecks] = useState({
    dimensions: false,
    weldQuality: false,
    surface: false,
    weight: false,
  });
  const [notes, setNotes] = useState('');
  const [overallResult, setOverallResult] = useState<'pass' | 'fail' | null>(null);

  const allChecksPassed = Object.values(checks).every(v => v === true);

  const inspectionItems = [
    { id: 'dimensions', label: 'Kích thước', icon: Ruler, tolerance: '±2mm' },
    { id: 'weldQuality', label: 'Chất lượng mối hàn', icon: Wrench, tolerance: 'Cấp B' },
    { id: 'surface', label: 'Bề mặt', icon: PaintBucket, tolerance: 'Không rỉ sét' },
    { id: 'weight', label: 'Trọng lượng', icon: AlertTriangle, tolerance: '±3%' },
  ];

  const handleSubmit = () => {
    if (!allChecksPassed) {
      setOverallResult('fail');
      onComplete('fail', notes);
    } else {
      setOverallResult('pass');
      onComplete('pass', notes);
    }
  };

  return (
    <div className="bg-bg-secondary border border-border rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="w-5 h-5 text-accent" />
        <h3 className="text-lg font-semibold text-text-primary">Kiểm tra chất lượng (QC)</h3>
      </div>

      <div className="space-y-4">
        {inspectionItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-3 bg-bg-tertiary rounded-lg">
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5 text-text-muted" />
              <div>
                <div className="font-medium text-text-primary">{item.label}</div>
                <div className="text-xs text-text-muted">Dung sai: {item.tolerance}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setChecks({ ...checks, [item.id]: true })}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  checks[item.id as keyof typeof checks]
                    ? "bg-success/20 text-success"
                    : "bg-bg-tertiary text-text-muted hover:bg-success/10"
                )}
              >
                <CheckCircle className="w-5 h-5" />
              </button>
              <button
                onClick={() => setChecks({ ...checks, [item.id]: false })}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  !checks[item.id as keyof typeof checks]
                    ? "bg-danger/20 text-danger"
                    : "bg-bg-tertiary text-text-muted hover:bg-danger/10"
                )}
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Ghi chú QC</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg text-text-primary resize-none"
            placeholder="Nhập kết quả kiểm tra, thông số cụ thể..."
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover"
        >
          Xác nhận kết quả QC
        </button>

        {overallResult === 'pass' && (
          <div className="p-3 bg-success/10 rounded-lg text-success text-center">
            ✅ Đạt yêu cầu chất lượng. Có thể chuyển sang bước tiếp theo.
          </div>
        )}
        
        {overallResult === 'fail' && (
          <div className="p-3 bg-danger/10 rounded-lg text-danger text-center">
            ❌ Không đạt yêu cầu. Cần xử lý lại trước khi tiếp tục.
          </div>
        )}
      </div>
    </div>
  );
}
