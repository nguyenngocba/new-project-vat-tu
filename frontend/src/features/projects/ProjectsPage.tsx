import { useState } from 'react';
import { useProjects, useProjectStats, useCreateProject, useUpdateProject, useDeleteProject } from '@/hooks/useProjects';
import { ProjectCard } from './components/ProjectCard';
import { ProjectDetail } from './components/ProjectDetail';
import { ProjectModal } from './components/ProjectModal';
import { Plus, Search } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/cn';

export function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const { data: projects, isLoading } = useProjects();
  const { data: stats } = useProjectStats();

  const filteredProjects = projects?.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    return true;
  });

  const statsCards = [
    { label: 'Tổng dự án', value: stats?.totalProjects || 0, color: 'text-accent' },
    { label: 'Đang thi công', value: stats?.activeProjects || 0, color: 'text-warning' },
    { label: 'Tổng ngân sách', value: formatCurrency(stats?.totalBudget || 0), color: 'text-success' },
    { label: 'Đã sử dụng', value: formatCurrency(stats?.totalSpent || 0), color: 'text-warning' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Quản lý dự án</h1>
          <p className="text-text-secondary mt-1">Theo dõi tiến độ và chi phí các dự án</p>
        </div>
        <button
          onClick={() => {
            setModalMode('create');
            setShowModal(true);
          }}
          className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Thêm dự án
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card) => (
          <div key={card.label} className="bg-bg-secondary border border-border rounded-xl p-4">
            <p className="text-sm text-text-muted">{card.label}</p>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-bg-secondary border border-border rounded-xl p-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Tìm kiếm dự án..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-bg-tertiary border border-border rounded-lg"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-bg-tertiary border border-border rounded-lg"
          >
            <option value="all">Tất cả</option>
            <option value="planning">Lên kế hoạch</option>
            <option value="active">Đang thi công</option>
            <option value="completed">Hoàn thành</option>
            <option value="on_hold">Tạm dừng</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-text-muted">Đang tải...</div>
      ) : !filteredProjects?.length ? (
        <div className="text-center py-12 text-text-muted">Không có dự án nào</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => {
                setSelectedProject(project);
                setShowDetail(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {showModal && (
        <ProjectModal
          mode={modalMode}
          project={modalMode === 'edit' ? selectedProject : undefined}
          onClose={() => {
            setShowModal(false);
            setSelectedProject(null);
          }}
          onSuccess={() => {
            setShowModal(false);
            setSelectedProject(null);
          }}
        />
      )}

      {showDetail && selectedProject && (
        <ProjectDetail
          project={selectedProject}
          onClose={() => {
            setShowDetail(false);
            setSelectedProject(null);
          }}
          onEdit={() => {
            setShowDetail(false);
            setModalMode('edit');
            setShowModal(true);
          }}
        />
      )}
    </div>
  );
}
