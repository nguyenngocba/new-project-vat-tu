import { useState } from 'react';
import { Structure } from '@/types/structure.types';
import { X, Package, TrendingUp, ArrowLeftRight, Plus, Send } from 'lucide-react';
import { ProductionWorkflow } from './ProductionWorkflow';
import { QCInspection } from './QCInspection';
import { toast } from 'sonner';

interface StructureDetailProps {
  structure: Structure;
  onClose: () => void;
  onEdit: () => void;
  onProduce: () => void;
  onExport: () => void;
}

export function StructureDetail({ structure, onClose, onEdit, onProduce, onExport }: StructureDetailProps) {
  const [activeTab, setActiveTab] = useState<'workflow' | 'bom' | 'history'>('workflow');
  const [productionStatus, setProductionStatus] = useState(structure.status === 'in_stock' ? 'ready' : 'design');

  const handleQCComplete = (result: 'pass' | 'fail', notes: string) => {
    if (result === 'pass') {
      toast.success('QC đạt yêu cầu!');
      setProductionStatus('painting');
    } else {
      toast.error('QC không đạt! Vui lòng kiểm tra lại.');
    }
  };

  const tabs = [
    { id: 'workflow', label: 'Quy trình SX', icon: TrendingUp },
    { id: 'bom', label: 'BOM', icon: Package },
    { id: 'history', label: 'Lịch sử', icon: ArrowLeftRight },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-bg-secondary rounded-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">{structure.name}</h2>
            <p className="text-sm text-text-muted">Mã: {structure.code} | Loại: {structure.type}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onProduce}
              className="px-3 py-1.5 text-sm bg-success text-white rounded-lg hover:bg-success/90"
            >
              Sản xuất
            </button>
            <button
              onClick={onExport}
              className="px-3 py-1.5 text-sm bg-warning text-white rounded-lg hover:bg-warning/90"
            >
              Xuất
            </button>
            <button
              onClick={onEdit}
              className="px-3 py-1.5 text-sm bg-accent text-white rounded-lg hover:bg-accent-hover"
            >
              Sửa
            </button>
            <button onClick={onClose} className="p-2 hover:bg-bg-tertiary rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-4 border-b border-border bg-bg-tertiary">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-accent text-white'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/80'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'workflow' && (
            <div className="space-y-6">
              <ProductionWorkflow
                structure={structure}
                currentStatus={productionStatus}
                onStatusChange={setProductionStatus}
              />
              
              {productionStatus === 'qc' && (
                <QCInspection
                  structureId={structure.id}
                  onComplete={handleQCComplete}
                />
              )}
            </div>
          )}

          {activeTab === 'bom' && (
            <div className="text-center py-12 text-text-muted">
              BOM đang được xây dựng...
            </div>
          )}

          {activeTab === 'history' && (
            <div className="text-center py-12 text-text-muted">
              Lịch sử sản xuất đang được xây dựng...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
