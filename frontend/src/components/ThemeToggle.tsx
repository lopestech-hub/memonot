import { FiMoon, FiSun } from 'react-icons/fi'
import { useThemeStore } from '../store/useThemeStore'

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore()

  return (
    <button
      onClick={toggleTheme}
      className="w-full flex items-center justify-between px-2.5 h-7 rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors"
    >
      <span>{theme === 'light' ? 'Tema claro' : 'Tema escuro'}</span>
      {theme === 'light' ? <FiSun className="h-4 w-4" /> : <FiMoon className="h-4 w-4" />}
    </button>
  )
}
