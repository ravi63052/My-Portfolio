import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return <button className="theme-toggle" type="button" aria-label="Dark theme" aria-pressed={theme === 'dark'} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} onClick={toggleTheme}>
    <Sun className="theme-sun" size={19} aria-hidden="true"/>
    <Moon className="theme-moon" size={19} aria-hidden="true"/>
  </button>;
}
