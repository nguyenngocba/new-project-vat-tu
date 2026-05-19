import { useState, useEffect } from 'react';
import { useCategories, useCreateCategory, useDeleteCategory, useUnits, useCreateUnit, useDeleteUnit, useUsers, useCreateUser, useDeleteUser, useSystemSettings, useUpdateSystemSettings } from '@/hooks/useSettings';
import { Plus, Trash2, UserPlus, Shield, Database, Sun, Moon } from 'lucide-react';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'categories' | 'units' | 'users' | 'system'>('categories');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [newCategory, setNewCategory] = useState('');
  const [newUnit, setNewUnit] = useState({ name: '', symbol: '' });
  const [newUser, setNewUser] = useState({ username: '', email: '', fullName: '', role: 'staff' as const, password: '' });
  
  const { data: categories } = useCategories();
  const { data: units } = useUnits();
  const { data: users } = useUsers();
  const { data: settings } = useSystemSettings();
  
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();
  const createUnit = useCreateUnit();
  const deleteUnit = useDeleteUnit();
  const createUser = useCreateUser();
  const deleteUser = useDeleteUser();
  const updateSettings = useUpdateSystemSettings();

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'dark';
    setTheme(savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const tabs = [
    { id: 'categories', label: 'Danh mục vật tư', icon: Database },
    { id: 'units', label: 'Đơn vị tính', icon: Database },
    { id: 'users', label: 'Người dùng', icon: UsersIcon },
    { id: 'system', label: 'Hệ thống', icon: Shield },
  ];

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim()) {
      await createCategory.mutateAsync(newCategory);
      setNewCategory('');
    }
  };

  const handleAddUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newUnit.name.trim() && newUnit.symbol.trim()) {
      await createUnit.mutateAsync(newUnit);
      setNewUnit({ name: '', symbol: '' });
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newUser.username && newUser.email && newUser.fullName && newUser.password) {
      await createUser.mutateAsync(newUser);
      setNewUser({ username: '', email: '', fullName: '', role: 'staff', password: '' });
    }
  };

  const handleToggleTheme = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    await updateSettings.mutateAsync({ theme: newTheme });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Cài đặt hệ thống</h1>
        <p className="text-text-secondary mt-1">Quản lý cấu hình và tùy chỉnh hệ thống</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-accent text-accent'
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div className="bg-bg-secondary border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Quản lý danh mục vật tư</h3>
          
          <form onSubmit={handleAddCategory} className="flex gap-3 mb-6">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Tên danh mục mới..."
              className="flex-1 px-3 py-2 bg-bg-tertiary border border-border rounded-lg"
            />
            <button type="submit" className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Thêm
            </button>
          </form>
          
          <div className="space-y-2">
            {categories?.map((cat) => (
              <div key={cat.id} className="flex justify-between items-center p-3 bg-bg-tertiary rounded-lg">
                <span className="text-text-primary">{cat.name}</span>
                <button
                  onClick={() => deleteCategory.mutate(cat.id)}
                  className="p-1 hover:bg-danger/10 rounded text-danger"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Units Tab */}
      {activeTab === 'units' && (
        <div className="bg-bg-secondary border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Quản lý đơn vị tính</h3>
          
          <form onSubmit={handleAddUnit} className="flex gap-3 mb-6">
            <input
              type="text"
              value={newUnit.name}
              onChange={(e) => setNewUnit({ ...newUnit, name: e.target.value })}
              placeholder="Tên đơn vị (VD: Mét)"
              className="flex-1 px-3 py-2 bg-bg-tertiary border border-border rounded-lg"
            />
            <input
              type="text"
              value={newUnit.symbol}
              onChange={(e) => setNewUnit({ ...newUnit, symbol: e.target.value })}
              placeholder="Ký hiệu (VD: m)"
              className="w-24 px-3 py-2 bg-bg-tertiary border border-border rounded-lg"
            />
            <button type="submit" className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Thêm
            </button>
          </form>
          
          <div className="space-y-2">
            {units?.map((unit) => (
              <div key={unit.id} className="flex justify-between items-center p-3 bg-bg-tertiary rounded-lg">
                <div>
                  <span className="text-text-primary font-medium">{unit.name}</span>
                  <span className="text-text-muted text-sm ml-2">({unit.symbol})</span>
                </div>
                <button
                  onClick={() => deleteUnit.mutate(unit.id)}
                  className="p-1 hover:bg-danger/10 rounded text-danger"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-bg-secondary border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Quản lý người dùng</h3>
          
          <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
            <input
              type="text"
              value={newUser.fullName}
              onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
              placeholder="Họ tên"
              className="px-3 py-2 bg-bg-tertiary border border-border rounded-lg"
            />
            <input
              type="text"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              placeholder="Tên đăng nhập"
              className="px-3 py-2 bg-bg-tertiary border border-border rounded-lg"
            />
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              placeholder="Email"
              className="px-3 py-2 bg-bg-tertiary border border-border rounded-lg"
            />
            <input
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              placeholder="Mật khẩu"
              className="px-3 py-2 bg-bg-tertiary border border-border rounded-lg"
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
              className="px-3 py-2 bg-bg-tertiary border border-border rounded-lg"
            >
              <option value="admin">Admin</option>
              <option value="manager">Quản lý</option>
              <option value="staff">Nhân viên</option>
            </select>
            <button type="submit" className="md:col-span-5 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover flex items-center justify-center gap-2">
              <UserPlus className="w-4 h-4" />
              Thêm người dùng
            </button>
          </form>
          
          <div className="space-y-2">
            {users?.map((user) => (
              <div key={user.id} className="flex justify-between items-center p-3 bg-bg-tertiary rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-text-primary">{user.fullName}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      user.role === 'admin' ? 'bg-danger/10 text-danger' :
                      user.role === 'manager' ? 'bg-warning/10 text-warning' :
                      'bg-success/10 text-success'
                    }`}>
                      {user.role === 'admin' ? 'Admin' : user.role === 'manager' ? 'Quản lý' : 'Nhân viên'}
                    </span>
                    {!user.isActive && <span className="text-xs text-text-muted">(Đã khóa)</span>}
                  </div>
                  <div className="text-sm text-text-muted">
                    @{user.username} · {user.email}
                  </div>
                </div>
                <button
                  onClick={() => deleteUser.mutate(user.id)}
                  className="p-1 hover:bg-danger/10 rounded text-danger"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* System Tab */}
      {activeTab === 'system' && (
        <div className="space-y-6">
          {/* Theme Settings */}
          <div className="bg-bg-secondary border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Giao diện</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-primary">Chế độ tối/sáng</p>
                <p className="text-sm text-text-muted">Chuyển đổi giao diện sáng hoặc tối</p>
              </div>
              <button
                onClick={handleToggleTheme}
                className="px-4 py-2 bg-bg-tertiary border border-border rounded-lg flex items-center gap-2"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {theme === 'dark' ? 'Sáng' : 'Tối'}
              </button>
            </div>
          </div>

          {/* System Info */}
          <div className="bg-bg-secondary border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Thông tin hệ thống</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-text-muted">Phiên bản</span>
                <span className="text-text-primary font-medium">SteelTrack v2.0.0</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-text-muted">Môi trường</span>
                <span className="text-text-primary font-medium">Production</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-text-muted">API Version</span>
                <span className="text-text-primary font-medium">v1</span>
              </div>
            </div>
          </div>

          {/* Export/Import */}
          <div className="bg-bg-secondary border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Dữ liệu</h3>
            <div className="flex gap-3">
              <button
                onClick={() => alert('Đang phát triển')}
                className="flex-1 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover"
              >
                Xuất dữ liệu (Backup)
              </button>
              <button
                onClick={() => alert('Đang phát triển')}
                className="flex-1 px-4 py-2 bg-bg-tertiary text-text-primary border border-border rounded-lg hover:bg-bg-tertiary/80"
              >
                Nhập dữ liệu (Restore)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// UsersIcon component
function UsersIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
