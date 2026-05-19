export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-text-secondary mt-1">Tổng quan hệ thống</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="text-2xl font-bold text-accent">0</div>
          <div className="text-text-secondary">Vật tư</div>
        </div>
        <div className="card">
          <div className="text-2xl font-bold text-accent">0</div>
          <div className="text-text-secondary">Dự án</div>
        </div>
        <div className="card">
          <div className="text-2xl font-bold text-accent">0</div>
          <div className="text-text-secondary">Cấu kiện</div>
        </div>
        <div className="card">
          <div className="text-2xl font-bold text-accent">0</div>
          <div className="text-text-secondary">Nhà cung cấp</div>
        </div>
      </div>
    </div>
  );
}
