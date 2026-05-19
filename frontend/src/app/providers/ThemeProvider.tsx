import { ReactNode, useEffect, useState } from 'react';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <div className="min-h-screen">
      {children}
      <button
        onClick={toggleTheme}
        className="fixed bottom-4 right-4 z-50 p-2 rounded-full bg-bg-tertiary border border-border shadow-lg hover:shadow-xl transition-all"
        aria-label="Toggle theme"
      >
        {isDark ? '☀️' : '🌙'}
      </button>
    </div>
  );
}
