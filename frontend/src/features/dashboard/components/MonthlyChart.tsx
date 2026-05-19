import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { MonthlyData } from '@/types/dashboard.types';
import { formatCurrency } from '@/lib/utils/cn';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface MonthlyChartProps {
  data: MonthlyData[];
  isLoading: boolean;
}

export function MonthlyChartComponent({ data, isLoading }: MonthlyChartProps) {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#94a3b8',
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#e2e8f0',
        bodyColor: '#94a3b8',
        callbacks: {
          label: (context: any) => {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            label += formatCurrency(context.raw);
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
        },
        ticks: {
          color: '#94a3b8',
        },
      },
      y: {
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
        },
        ticks: {
          color: '#94a3b8',
          callback: (value: any) => formatCurrency(value),
        },
      },
    },
  };

  const chartData = {
    labels: data.map(d => d.month),
    datasets: [
      {
        label: 'Nhập kho',
        data: data.map(d => d.import),
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Xuất kho',
        data: data.map(d => d.export),
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Tồn kho',
        data: data.map(d => d.stock),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  if (isLoading) {
    return (
      <div className="bg-bg-secondary border border-border rounded-xl p-4">
        <div className="animate-pulse h-[300px] bg-bg-tertiary rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-bg-secondary border border-border rounded-xl p-4">
      <h3 className="font-semibold text-text-primary mb-4">Biến động nhập - xuất - tồn kho</h3>
      <div className="h-[300px]">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
