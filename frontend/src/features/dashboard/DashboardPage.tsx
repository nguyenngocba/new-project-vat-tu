import { useDashboardStats, useRecentTransactions, useTopMaterials, useMonthlyData } from '@/hooks/useDashboard';
import { StatsCards } from './components/StatsCards';
import { RecentTransactions } from './components/RecentTransactions';
import { TopMaterials } from './components/TopMaterials';
import { MonthlyChartComponent } from './components/MonthlyChart';
import { Forecast } from './components/Forecast';

export function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: transactions, isLoading: transactionsLoading } = useRecentTransactions(10);
  const { data: topMaterials, isLoading: topMaterialsLoading } = useTopMaterials(5);
  const { data: monthlyData, isLoading: monthlyLoading } = useMonthlyData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-text-secondary mt-1">Tổng quan hệ thống quản lý kho thép</p>
      </div>

      {/* Stats Cards */}
      {stats && <StatsCards stats={stats} />}

      {/* Charts and Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MonthlyChartComponent data={monthlyData || []} isLoading={monthlyLoading} />
        </div>
        <div>
          <TopMaterials materials={topMaterials || []} isLoading={topMaterialsLoading} />
        </div>
      </div>

      {/* Forecast */}
      <Forecast />

      {/* Recent Transactions */}
      <RecentTransactions transactions={transactions || []} isLoading={transactionsLoading} />
    </div>
  );
}
