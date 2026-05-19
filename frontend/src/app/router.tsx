import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from './AppLayout';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { InventoryPage } from '@/features/inventory/InventoryPage';
import { ProjectsPage } from '@/features/projects/ProjectsPage';
import { StructuresPage } from '@/features/structures/StructuresPage';
import { YardPage } from '@/features/yard/YardPage';
import { SuppliersPage } from '@/features/suppliers/SuppliersPage';
import { SettingsPage } from '@/features/settings/SettingsPage';
import { LogsPage } from '@/features/logs/LogsPage';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <AppLayout />,
      children: [
        { index: true, element: <Navigate to="/dashboard" replace /> },
        { path: 'dashboard', element: <DashboardPage /> },
        { path: 'inventory', element: <InventoryPage /> },
        { path: 'projects', element: <ProjectsPage /> },
        { path: 'structures', element: <StructuresPage /> },
        { path: 'yard', element: <YardPage /> },
        { path: 'suppliers', element: <SuppliersPage /> },
        { path: 'logs', element: <LogsPage /> },
        { path: 'settings', element: <SettingsPage /> },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);
