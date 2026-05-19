import { useState } from 'react';
import { Structure } from '@/types/structure.types';
import { useStructureBOM, useStructureProductions, useStructureExports } from '@/hooks/useStructures';
import { useProjects } from '@/hooks/useProjects';
import { formatCurrency, formatDate, formatNumber } from '@/lib/utils/cn';
import { X, Package, TrendingUp, ArrowLeftRight, Plus, Send } from 'lucide-react';

interface StructureDetailProps {
  structure: Structure;
  onClose: () => void;
  onEdit: () => void;
  onProduce: () => void;
  onExport: () => void;
}

export function StructureDetail({ structure, onClose, onEdit, onProduce, onExport }: StructureDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'bom' | 'productions' | 'exports'>('overview');
  const { data: bom, isLoading: bomLoading } = useStructureBOM(structure.id);
  const { data: productions, isLoading: productionsLoading } = useStructureProductions(structure.id);
  const { data: exports_data, isLoading: exportsLoading } = useStructureExports(structure.id);
  const { data: projects } = useProjects();

  const tabs = [
    { id: 'overview', label: 'Tổng quan', icon: TrendingUp },
    { id: 'bom', label: 'BOM', icon: Package, count: bom?.length },
    { id: 'productions', label: 'Sản xuất', icon: Plus, count: productions?.length },
    { id: 'exports', label: 'Xuất', icon: Send, count: exports_data?.length },
  ];

  const totalBOMCost = bom?.reduce((sum, m) => sum + m.totalCost, 0) || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-bg-secondary rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-bg-secondary border border-border rounded-xl p-4">
                  <p className="text-sm text-text-muted">Số lượng tồn</p>
                  <p className="text-2xl font-bold text-text-primary">
                    {formatNumber(structure.quantity)} {structure.unit}
                  </p>
                </div>
                <div className="bg-bg-secondary border border-border rounded-xl p-4">
                  <p className="text-sm text-text-muted">Đơn giá</p>
                  <p className="text-2xl font-bold text-text-primary">{formatCurrency(structure.cost)}</p>
                </div>
                <div className="bg-bg-secondary border border-border rounded-xl p-4">
                  <p className="text-sm text-text-muted">Tổng giá trị</p>
                  <p className="text-2xl font-bold text-accent">
                    {formatCurrency(structure.cost * structure.quantity)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-bg-secondary border border-border rounded-xl p-4">
                  <h3 className="font-semibold text-text-primary mb-3">Kích thước</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Dài:</span>
                      <span>{structure.length} m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Rộng:</span>
                      <span>{structure.width} m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Cao:</span>
                      <span>{structure.height} m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Trọng lượng:</span>
                      <span>{formatNumber(structure.weight)} kg</span>
                    </div>
                  </div>
                </div>

                <div className="bg-bg-secondary border border-border rounded-xl p-4">
                  <h3 className="font-semibold text-text-primary mb-3">Vị trí yard</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Khu vực:</span>
                      <span>Khu {structure.zone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Vị trí:</span>
                      <span>Hàng {structure.positionY}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Layer:</span>
                      <span>Lớp {structure.layer}</span>
                    </div>
                  </div>
                </div>
              </div>

              {structure.projectName && (
                <div className="bg-bg-secondary border border-border rounded-xl p-4">
                  <h3 className="font-semibold text-text-primary mb-2">Dự án</h3>
                  <p className="text-text-primary">{structure.projectName}</p>
                </div>
              )}

              {structure.note && (
                <div className="bg-bg-secondary border border-border rounded-xl p-4">
                  <h3 className="font-semibold text-text-primary mb-2">Ghi chú</h3>
                  <p className="text-text-secondary">{structure.note}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'bom' && (
            <div className="space-y-4">
              {bomLoading ? (
                <div className="text-center py-8 text-text-muted">Đang tải...</div>
              ) : !bom?.length ? (
                <div className="text-center py-8 text-text-muted">Chưa có BOM</div>
              ) : (
                <>
                  <div className="bg-bg-tertiary p-3 rounded-lg flex justify-between">
                    <span className="font-medium">Tổng chi phí BOM:</span>
                    <span className="font-bold text-accent">{formatCurrency(totalBOMCost)}</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-bg-tertiary">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm">Vật tư</th>
                          <th className="px-4 py-3 text-right text-sm">Số lượng</th>
                          <th className="px-4 py-3 text-right text-sm">Đơn giá</th>
                          <th className="px-4 py-3 text-right text-sm">Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bom.map((item) => (
                          <tr key={item.id} className="border-b border-border">
                            <td className="px-4 py-3">
                              <div className="font-medium">{item.materialName}</div>
                              <div className="text-xs text-text-muted">{item.unit}</div>
                            </td>
                            <td className="px-4 py-3 text-right">{formatNumber(item.quantity)}</td>
                            <td className="px-4 py-3 text-right">{formatCurrency(item.cost)}</td>
                            <td className="px-4 py-3 text-right font-medium text-accent">
                              {formatCurrency(item.totalCost)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'productions' && (
            <div className="space-y-3">
              {productionsLoading ? (
                <div className="text-center py-8 text-text-muted">Đang tải...</div>
              ) : !productions?.length ? (
                <div className="text-center py-8 text-text-muted">Chưa có lịch sử sản xuất</div>
              ) : (
                productions.map((p) => (
                  <div key={p.id} className="bg-bg-secondary border border-border rounded-xl p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-1 rounded-full bg-success/10 text-success">
                            Sản xuất
                          </span>
                          <span className="font-medium">{formatDate(p.date)}</span>
                        </div>
                        <p className="text-sm mt-2">
                          Số lượng: <strong>{formatNumber(p.quantity)}</strong> {structure.unit}
                        </p>
                        {p.note && <p className="text-xs text-text-muted mt-1">📝 {p.note}</p>}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'exports' && (
            <div className="space-y-3">
              {exportsLoading ? (
                <div className="text-center py-8 text-text-muted">Đang tải...</div>
              ) : !exports_data?.length ? (
                <div className="text-center py-8 text-text-muted">Chưa có lịch sử xuất</div>
              ) : (
                exports_data.map((e) => (
                  <div key={e.id} className="bg-bg-secondary border border-border rounded-xl p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-1 rounded-full bg-warning/10 text-warning">
                            Xuất
                          </span>
                          <span className="font-medium">{formatDate(e.date)}</span>
                        </div>
                        <p className="text-sm mt-2">
                          Công trình: <strong>{e.projectName}</strong>
                        </p>
                        <p className="text-sm">
                          Số lượng: <strong>{formatNumber(e.quantity)}</strong> {structure.unit}
                        </p>
                        {e.note && <p className="text-xs text-text-muted mt-1">📝 {e.note}</p>}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
