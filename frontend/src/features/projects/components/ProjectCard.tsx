import { Project } from '@/types/project.types';
import { formatCurrency } from '@/lib/utils/cn';
import { Building2, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const progress = project.budget > 0 ? (project.spent / project.budget) * 100 : 0;
  const isOverBudget = progress > 100;
  const isNearLimit = progress >= 90 && progress <= 100;
  
  const getStatusIcon = () => {
    if (isOverBudget) return <AlertTriangle className="w-5 h-5 text-danger" />;
    if (isNearLimit) return <AlertTriangle className="w-5 h-5 text-warning" />;
    if (project.status === 'completed') return <CheckCircle className="w-5 h-5 text-success" />;
    return <TrendingUp className="w-5 h-5 text-accent" />;
  };
  
  const getStatusText = () => {
    if (isOverBudget) return 'Vượt ngân sách';
    if (isNearLimit) return 'Sắp hết ngân sách';
    if (project.status === 'completed') return 'Hoàn thành';
    if (project.status === 'active') return 'Đang thi công';
    return 'Lên kế hoạch';
  };
  
  const getStatusColor = () => {
    if (isOverBudget) return 'bg-danger/10 text-danger border-danger/20';
    if (isNearLimit) return 'bg-warning/10 text-warning border-warning/20';
    if (project.status === 'completed') return 'bg-success/10 text-success border-success/20';
    return 'bg-accent/10 text-accent border-accent/20';
  };

  return (
    <div
      onClick={onClick}
      className="bg-bg-secondary border border-border rounded-xl p-4 cursor-pointer hover:shadow-lg transition-all hover:border-accent/30"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-text-muted" />
          <div>
            <h3 className="font-semibold text-text-primary">{project.name}</h3>
            <p className="text-xs text-text-muted">{project.code}</p>
          </div>
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor()}`}>
          {getStatusIcon()}
          <span>{getStatusText()}</span>
        </div>
      </div>
      
      <div className="space-y-3 mt-4">
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Ngân sách:</span>
          <span className="font-medium text-text-primary">{formatCurrency(project.budget)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Đã sử dụng:</span>
          <span className="font-medium text-warning">{formatCurrency(project.spent)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Còn lại:</span>
          <span className={`font-medium ${isOverBudget ? 'text-danger' : 'text-success'}`}>
            {formatCurrency(project.budget - project.spent)}
          </span>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-text-muted">Tiến độ</span>
            <span className={`font-medium ${isOverBudget ? 'text-danger' : isNearLimit ? 'text-warning' : 'text-success'}`}>
              {Math.min(progress, 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-bg-tertiary rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                isOverBudget ? 'bg-danger' : isNearLimit ? 'bg-warning' : 'bg-success'
              }`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
