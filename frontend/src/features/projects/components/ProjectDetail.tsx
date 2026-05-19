import { useState } from 'react';
import { Project } from '@/types/project.types';
import { useProjectMaterials, useProjectTransactions } from '@/hooks/useProjects';
import { formatCurrency, formatDate } from '@/lib/utils/cn';
import { X, Package, TrendingUp, ArrowLeftRight } from 'lucide-react';

interface ProjectDetailProps {
  project: Project;
  onClose: () => void;
  onEdit: () => void;
}

export function ProjectDetail({ project, onClose, onEdit }: ProjectDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'materials' | 'transactions'>('overview');
  const { data: materials, isLoading: materialsLoading } = useProjectMaterials(project.id);
  const { data: transactions, isLoading: transactionsLoading } = useProjectTransactions(project.id);

  const progress = project.budget > 0 ? (project.spent / project.budget) * 100 : 0;
  const isOverBudget = progress > 100;

  const tabs = [
    { id: 'overview', label: 'Tổng quan', icon: TrendingUp },
    { id: 'materials', label: 'Vật tư', icon: Package, count: materials?.length },
    { id: 'transactions', label: 'Giao dịch', icon: ArrowLeftRight, count: transactions?.length },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-bg-secondary rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">{project.name}</h2>
            <p className="text-sm text-text-muted">Mã: {project.code}</p>
          </div>
          <div className="flex gap-2">
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
              {tab.count !== undefined && tab.count > 0 && (
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-white/20">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-bg-secondary border border-border rounded-xl p-4">
                <h3 className="font-semibold text-text-primary mb-3">Tiến độ</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Hoàn thành</span>
                    <span className={isOverBudget ? 'text-danger' : 'text-success'}>
                      {Math.min(progress, 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-bg-tertiary rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isOverBudget ? 'bg-danger' : 'bg-success'
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-bg-secondary border border-border rounded-xl p-4">
                  <p className="text-sm text-text-muted">Ngân sách</p>
                  <p className="text-2xl font-bold text-text-primary">{formatCurrency(project.budget)}</p>
                </div>
                <div className="bg-bg-secondary border border-border rounded-xl p-4">
                  <p className="text-sm text-text-muted">Đã sử dụng</p>
                  <p className="text-2xl font-bold text-warning">{formatCurrency(project.spent)}</p>
                </div>
                <div className="bg-bg-secondary border border-border rounded-xl p-4">
                  <p className="text-sm text-text-muted">Còn lại</p>
                  <p className={`text-2xl font-bold ${isOverBudget ? 'text-danger' : 'text-success'}`}>
                    {formatCurrency(project.budget - project.spent)}
                  </p>
                </div>
              </div>

              {(project.startDate || project.expectedEndDate) && (
                <div className="bg-bg-secondary border border-border rounded-xl p-4">
                  <h3 className="font-semibold text-text-primary mb-3">Thời gian</h3>
                  <div className="space-y-2">
                    {project.startDate && (
                      <div className="flex justify-between">
                        <span className="text-text-muted">Ngày bắt đầu:</span>
                        <span>{formatDate(project.startDate)}</span>
                      </div>
                    )}
                    {project.expectedEndDate && (
                      <div className="flex justify-between">
                        <span className="text-text-muted">Ngày dự kiến kết thúc:</span>
                        <span>{formatDate(project.expectedEndDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'materials' && (
            <div className="space-y-4">
              {materialsLoading ? (
                <div className="text-center py-8 text-text-muted">Đang tải...</div>
              ) : !materials?.length ? (
                <div className="text-center py-8 text-text-muted">Chưa có vật tư nào</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-bg-tertiary">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm">Vật tư</th>
                        <th className="px-4 py-3 text-right text-sm">Đã dùng</th>
                        <th className="px-4 py-3 text-right text-sm">Đã trả</th>
                        <th className="px-4 py-3 text-right text-sm">Còn lại</th>
                        <th className="px-4 py-3 text-right text-sm">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {materials.map((m) => (
                        <tr key={m.materialId} className="border-b border-border">
                          <td className="px-4 py-3">
                            <div className="font-medium">{m.materialName}</div>
                            <div className="text-xs text-text-muted">{m.unit}</div>
                          </td>
                          <td className="px-4 py-3 text-right">{m.usedQuantity}</td>
                          <td className="px-4 py-3 text-right text-success">{m.returnedQuantity}</td>
                          <td className="px-4 py-3 text-right font-medium">{m.remainingQuantity}</td>
                          <td className="px-4 py-3 text-right font-medium text-accent">
                            {formatCurrency(m.totalCost)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="space-y-4">
              {transactionsLoading ? (
                <div className="text-center py-8 text-text-muted">Đang tải...</div>
              ) : !transactions?.length ? (
                <div className="text-center py-8 text-text-muted">Chưa có giao dịch nào</div>
              ) : (
                <div className="space-y-3">
                  {transactions.map((t) => (
                    <div key={t.id} className="bg-bg-secondary border border-border rounded-xl p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              t.type === 'usage' || t.type === 'structure_export'
                                ? 'bg-warning/10 text-warning'
                                : 'bg-success/10 text-success'
                            }`}>
                              {t.type === 'usage' || t.type === 'structure_export' ? 'Xuất' : 'Trả'}
                            </span>
                            <span className="font-medium">{t.materialName}</span>
                          </div>
                          <p className="text-xs text-text-muted mt-1">
                            {formatDate(t.date)} · {t.quantity} {t.unit} × {formatCurrency(t.unitPrice)}
                          </p>
                          {t.note && <p className="text-xs text-text-muted mt-1">📝 {t.note}</p>}
                        </div>
                        <div className={`font-bold ${
                          t.type === 'usage' || t.type === 'structure_export'
                            ? 'text-warning'
                            : 'text-success'
                        }`}>
                          {t.type === 'usage' || t.type === 'structure_export' ? '-' : '+'}
                          {formatCurrency(t.totalAmount)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border flex gap-3">
          <button
            onClick={() => window.location.href = `/inventory?project=${project.id}`}
            className="flex-1 px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90"
          >
            Xuất kho cho dự án
          </button>
          <button
            onClick={() => window.location.href = `/structures?project=${project.id}`}
            className="flex-1 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover"
          >
            Xuất cấu kiện
          </button>
        </div>
      </div>
    </div>
  );
}
