import { useState } from 'react';
import { Structure } from '@/types/structure.types';
import { CheckCircle, Circle, Wrench, PaintBucket, Package, Truck, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface ProductionWorkflowProps {
  structure: Structure;
  currentStatus: string;
  onStatusChange: (status: string) => void;
}

interface WorkflowStep {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  canStart: boolean;
  requiresQC: boolean;
}

export function ProductionWorkflow({ structure, currentStatus, onStatusChange }: ProductionWorkflowProps) {
  const [selectedStep, setSelectedStep] = useState(currentStatus);

  const steps: WorkflowStep[] = [
    { id: 'design', name: 'Thiết kế', icon: <Package className="w-5 h-5" />, description: 'Kiểm tra bản vẽ, xác nhận thông số', canStart: true, requiresQC: false },
    { id: 'waiting_material', name: 'Chờ vật tư', icon: <Clock className="w-5 h-5" />, description: 'Kiểm tra tồn kho vật tư trong BOM', canStart: true, requiresQC: false },
    { id: 'cutting', name: 'Cắt', icon: <Wrench className="w-5 h-5" />, description: 'Cắt thép theo kích thước yêu cầu', canStart: true, requiresQC: true },
    { id: 'welding', name: 'Hàn', icon: <Wrench className="w-5 h-5" />, description: 'Hàn ghép các bộ phận', canStart: true, requiresQC: true },
    { id: 'qc', name: 'QC', icon: <AlertCircle className="w-5 h-5" />, description: 'Kiểm tra chất lượng, kích thước, mối hàn', canStart: true, requiresQC: false },
    { id: 'painting', name: 'Sơn', icon: <PaintBucket className="w-5 h-5" />, description: 'Sơn chống gỉ, hoàn thiện bề mặt', canStart: true, requiresQC: true },
    { id: 'stacking', name: 'Tập kết', icon: <Package className="w-5 h-5" />, description: 'Đưa vào yard map, cập nhật vị trí', canStart: true, requiresQC: false },
    { id: 'ready', name: 'Chờ xuất', icon: <Truck className="w-5 h-5" />, description: 'Sẵn sàng xuất cho công trình', canStart: true, requiresQC: false },
  ];

  const getStepStatus = (stepId: string) => {
    const stepIndex = steps.findIndex(s => s.id === stepId);
    const currentIndex = steps.findIndex(s => s.id === currentStatus);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed': return 'border-success bg-success/10 text-success';
      case 'current': return 'border-accent bg-accent/10 text-accent shadow-lg';
      default: return 'border-border bg-bg-tertiary text-text-muted';
    }
  };

  return (
    <div className="bg-bg-secondary border border-border rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-text-primary">Quy trình sản xuất</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-muted">Mã cấu kiện:</span>
          <span className="text-accent font-mono">{structure.code}</span>
        </div>
      </div>

      {/* Workflow Timeline */}
      <div className="relative">
        {/* Connecting line */}
        <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-border" />
        
        {/* Steps */}
        <div className="space-y-6 relative">
          {steps.map((step, idx) => {
            const status = getStepStatus(step.id);
            const isCompleted = status === 'completed';
            const isCurrent = status === 'current';
            
            return (
              <div key={step.id} className="relative flex gap-4">
                {/* Status icon */}
                <div className={cn(
                  "flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all cursor-pointer",
                  getStepColor(status)
                )}>
                  {isCompleted ? (
                    <CheckCircle className="w-8 h-8" />
                  ) : (
                    step.icon
                  )}
                </div>
                
                {/* Step content */}
                <div className="flex-1 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className={cn(
                      "font-semibold",
                      isCurrent ? "text-accent" : isCompleted ? "text-success" : "text-text-primary"
                    )}>
                      {step.name}
                    </h4>
                    {isCurrent && (
                      <button
                        onClick={() => {
                          const nextIndex = steps.findIndex(s => s.id === step.id) + 1;
                          if (nextIndex < steps.length) {
                            onStatusChange(steps[nextIndex].id);
                          }
                        }}
                        className="px-3 py-1 text-sm bg-accent text-white rounded-lg hover:bg-accent-hover"
                      >
                        Hoàn thành bước này
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-text-muted mt-1">{step.description}</p>
                  
                  {/* QC Note */}
                  {step.requiresQC && isCurrent && (
                    <div className="mt-2 p-2 bg-warning/10 rounded-lg text-xs text-warning">
                      ⚠️ Yêu cầu kiểm tra QC trước khi chuyển bước
                    </div>
                  )}
                  
                  {/* Timestamp (simulated) */}
                  {isCompleted && (
                    <p className="text-xs text-text-muted mt-2">
                      Hoàn thành lúc: {new Date().toLocaleString('vi-VN')}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Status Summary */}
      <div className="mt-6 p-4 bg-accent/5 rounded-lg border border-accent/20">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          <span className="text-sm text-accent font-medium">Trạng thái hiện tại:</span>
          <span className="text-sm text-text-primary">
            {steps.find(s => s.id === currentStatus)?.name || currentStatus}
          </span>
        </div>
        <div className="mt-2">
          <div className="w-full bg-bg-tertiary rounded-full h-2">
            <div 
              className="bg-accent h-2 rounded-full transition-all duration-500"
              style={{ width: `${(steps.findIndex(s => s.id === currentStatus) + 1) / steps.length * 100}%` }}
            />
          </div>
          <p className="text-xs text-text-muted mt-2">
            Tiến độ: {Math.round((steps.findIndex(s => s.id === currentStatus) + 1) / steps.length * 100)}% hoàn thành
          </p>
        </div>
      </div>
    </div>
  );
}
