import React from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useTheme } from '../../utils/ThemeContext';
import { Button } from '@/components/ui/button';

export const ThemeToggle = ({ className }) => {
  const { theme, toggleTheme, resolvedTheme } = useTheme();

  let icon, label;
  if (theme === 'system') {
    icon = <Laptop size={18} />;
    label = `Modo sistema (${resolvedTheme === 'dark' ? 'oscuro' : 'claro'})`;
  } else if (theme === 'light') {
    icon = <Moon size={18} />;
    label = 'Cambiar a modo oscuro';
  } else {
    icon = <Sun size={18} />;
    label = 'Cambiar a modo claro';
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className={className}
      aria-label={label}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </Button>
  );
};

export default ThemeToggle;