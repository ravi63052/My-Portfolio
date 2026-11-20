import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({ theme: 'dark', toggleTheme: () => {} });
const valid = value => value === 'dark' || value === 'light';

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'dark');
  useEffect(() => {
    const system = matchMedia('(prefers-color-scheme: dark)');
    const followSystem = () => {
      let saved;
      try { saved = localStorage.getItem('portfolio-theme'); } catch { /* Storage is optional. */ }
      if (!valid(saved)) setTheme(system.matches ? 'dark' : 'light');
    };
    const sync = event => {
      if (event.key !== 'portfolio-theme' && event.key !== null) return;
      if (valid(event.newValue)) setTheme(event.newValue);
      else followSystem();
    };
    system.addEventListener('change', followSystem);
    window.addEventListener('storage', sync);
    return () => { system.removeEventListener('change', followSystem); window.removeEventListener('storage', sync); };
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0b1110' : '#f5f8f5');
  }, [theme]);
  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('portfolio-theme', next); } catch { /* Keep the control usable without storage. */ }
    setTheme(next);
  }
  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
