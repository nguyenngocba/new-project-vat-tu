import { useState } from 'react';
import { Project } from '@/types/project.types';
import { ChevronRight, ChevronDown, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils/cn';

interface Task {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  progress: number;
  subTasks?: Task[];
}

interface ProjectGanttProps {
  project: Project;
  tasks: Task[];
}

export function ProjectGantt({ project, tasks }: ProjectGanttProps) {
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

  const toggleExpand = (taskId: string) => {
    const newSet = new Set(expandedTasks);
    if (newSet.has(taskId)) {
      newSet.delete(taskId);
    } else {
      newSet.add(taskId);
    }
    setExpandedTasks(newSet);
  };

  const renderTask = (task: Task, level: number = 0) => {
    const isExpanded = expandedTasks.has(task.id);
    const hasSubTasks = task.subTasks && task.subTasks.length > 0;
    const start = new Date(task.startDate);
    const end = new Date(task.endDate);
    const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const today = new Date();
    const isOverdue = end < today && task.progress < 100;

    return (
      <div key={task.id}>
        <div 
          className={`flex items-center gap-3 p-3 border-b border-border hover:bg-bg-tertiary transition-colors cursor-pointer`}
          style={{ paddingLeft: `${level * 24 + 12}px` }}
        >
          {hasSubTasks && (
            <button onClick={() => toggleExpand(task.id)} className="text-text-muted">
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          )}
          {!hasSubTasks && <div className="w-4" />}
          
          <div className="flex-1">
            <div className="font-medium text-text-primary">{task.name}</div>
            <div className="text-xs text-text-muted">
              {formatDate(task.startDate)} → {formatDate(task.endDate)} ({duration} ngày)
            </div>
          </div>
          
          <div className="w-32">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-text-muted">Tiến độ</span>
              <span className={isOverdue ? 'text-danger' : 'text-accent'}>{task.progress}%</span>
            </div>
            <div className="w-full bg-bg-tertiary rounded-full h-2 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all ${isOverdue ? 'bg-danger' : 'bg-accent'}`}
                style={{ width: `${task.progress}%` }}
              />
            </div>
          </div>
          
          {isOverdue && (
            <div className="text-danger text-xs">Quá hạn</div>
          )}
        </div>
        
        {hasSubTasks && isExpanded && (
          <div>
            {task.subTasks!.map(subTask => renderTask(subTask, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-bg-secondary border border-border rounded-xl overflow-hidden">
      <div className="p-4 border-b border-border bg-bg-tertiary">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-accent" />
          <h3 className="font-semibold text-text-primary">Tiến độ dự án</h3>
        </div>
      </div>
      <div className="max-h-[500px] overflow-y-auto">
        {tasks.map(task => renderTask(task))}
      </div>
    </div>
  );
}
