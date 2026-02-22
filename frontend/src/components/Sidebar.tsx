import { Link, useLocation } from 'react-router-dom'
import { FiHome, FiFileText, FiFolder, FiSettings, FiEdit3, FiPlus } from 'react-icons/fi'
import { useAuthStore } from '../store/useAuthStore'
import { useNotasStore } from '../store/useNotasStore'
import { ThemeToggle } from './ThemeToggle'

export function Sidebar() {
  const location = useLocation()
  const { user } = useAuthStore()
  const { categorias } = useNotasStore()

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path)
  }

  const navItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/notes', icon: FiFileText, label: 'Todas as Notas' },
  ]

  return (
    <aside className="w-64 bg-[var(--bg-card)] border-r border-[var(--border)] flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="h-12 px-3 flex items-center gap-2 border-b border-[var(--border)]">
        <FiEdit3 className="h-4 w-4 text-[var(--text-secondary)]" />
        <div>
          <h1 className="text-base font-bold text-[var(--text-primary)]">MemoNot</h1>
          <p className="text-xs text-[var(--text-secondary)]">{user?.nome}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {/* Nova Nota */}
        <Link
          to="/notes/new"
          className="mb-3 h-8 w-full flex items-center justify-center gap-1.5 text-xs font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors"
        >
          <FiPlus className="h-3.5 w-3.5" />
          Nova Nota
        </Link>

        {/* Main Navigation */}
        <div className="space-y-0.5 mb-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 px-2.5 h-7 rounded-lg text-xs font-medium transition-colors ${
                isActive(item.path)
                  ? 'bg-violet-100/20 text-violet-600'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </div>

        {/* Categorias */}
        <div className="mb-4">
          <div className="flex items-center justify-between px-2.5 mb-1.5">
            <h3 className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Categorias
            </h3>
            <button className="h-5 w-5 flex items-center justify-center text-[var(--text-muted)] hover:text-violet-600 transition-colors">
              <FiPlus className="h-3 w-3" />
            </button>
          </div>
          <div className="space-y-0.5">
            {categorias.length > 0 ? (
              categorias.slice(0, 5).map((categoria) => (
                <button
                  key={categoria.id}
                  className="w-full flex items-center justify-between px-2.5 h-7 rounded-lg text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FiFolder className="h-3.5 w-3.5" />
                    <span className="truncate">{categoria.nome}</span>
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)] bg-[var(--bg-hover)] px-1 py-0.5 rounded">
                    {categoria._count?.notas || 0}
                  </span>
                </button>
              ))
            ) : (
              <p className="px-2.5 py-1.5 text-[10px] text-[var(--text-muted)]">Nenhuma categoria</p>
            )}
          </div>
        </div>
      </nav>

      {/* Settings & Theme */}
      <div className="p-2.5 border-t border-[var(--border)] space-y-1.5">
        <ThemeToggle />
        <Link
          to="/settings"
          className={`flex items-center gap-2 px-2.5 h-7 rounded-lg text-xs font-medium transition-colors ${
            isActive('/settings')
              ? 'bg-violet-100/20 text-violet-600'
              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
          }`}
        >
          <FiSettings className="h-4 w-4" />
          Configurações
        </Link>
      </div>
    </aside>
  )
}
