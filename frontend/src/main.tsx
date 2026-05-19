import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import { ThemeProvider } from './app/providers/ThemeProvider';
import { ToastProvider } from './app/providers/ToastProvider';
import './styles/globals.css';

// Optimized React Query config
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes - data is fresh
      gcTime: 1000 * 60 * 5, // 5 minutes - cache garbage collection
      refetchOnWindowFocus: false, // Don't refetch on window focus
      refetchOnMount: true, // Refetch on mount
      refetchOnReconnect: true, // Refetch on reconnect
      retry: 1, // Retry once on failure
      retryDelay: 1000, // Wait 1 second before retry
      placeholderData: (previousData) => previousData, // Keep previous data while loading
    },
    mutations: {
      retry: 0, // Don't retry mutations
    },
  },
});

// Prefetch critical data
queryClient.prefetchQuery({ queryKey: ['materials'], queryFn: () => import('@/services/material.service').then(m => m.materialService.getAll()) });
queryClient.prefetchQuery({ queryKey: ['projects'], queryFn: () => import('@/services/project.service').then(p => p.projectService.getAll()) });
queryClient.prefetchQuery({ queryKey: ['structures'], queryFn: () => import('@/services/structure.service').then(s => s.structureService.getAll()) });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
