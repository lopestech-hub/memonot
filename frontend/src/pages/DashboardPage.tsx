import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiFileText, FiPlus, FiSearch, FiFolder, FiLogOut, FiEdit3 } from 'react-icons/fi'
import { useNotasStore } from '../store/useNotasStore'
import { useAuthStore } from '../store/useAuthStore'
import { Sidebar } from '../components/Sidebar'

export function DashboardPage() {
  const { logout } = useAuthStore()
  const { notas, categorias, loadNotas, loadCategorias, isLoading } = useNotasStore()

  useEffect(() => {
    loadNotas()
    loadCategorias()
  }, [loadNotas, loadCategorias])

  const notasRecentes = notas.slice(0, 5)
  const totalNotas = notas.length
  const totalMarkdown = notas.filter(n => n.tipo === 'MARKDOWN').length

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="h-12 w-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[var(--bg-app)]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-[var(--bg-app)] text-[var(--text-primary)]">
        {/* Header */}
        <header className="h-12 bg-[var(--bg-card)]/80 backdrop-blur-sm border-b border-[var(--border)] sticky top-0 z-40">
          <div className="h-full px-3 sm:px-4 lg:px-6">
            <div className="flex justify-between items-center h-full">
              <h2 className="text-base font-semibold text-[var(--text-primary)]">Dashboard</h2>
              <div className="flex items-center gap-2">
                <button className="h-7 w-7 flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] rounded-lg transition-colors">
                  <FiSearch className="h-4 w-4" />
                </button>
                <button
                  onClick={logout}
                  className="h-7 w-7 flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] rounded-lg transition-colors"
                  title="Sair"
                >
                  <FiLogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-5">
        {/* Stats */}
        <div className="mb-5">
          <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Visão Geral</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-[var(--bg-card)] p-3 rounded-lg border border-[var(--border)] hover:border-violet-500/40 transition-colors">
              <div className="flex items-center gap-2.5">
                <FiFileText className="h-5 w-5 text-violet-600" />
                <div>
                  <p className="text-xs text-[var(--text-secondary)]">Total de Notas</p>
                  <p className="text-xl font-bold text-[var(--text-primary)]">{totalNotas}</p>
                </div>
              </div>
            </div>
            <div className="bg-[var(--bg-card)] p-3 rounded-lg border border-[var(--border)] hover:border-violet-500/40 transition-colors">
              <div className="flex items-center gap-2.5">
                <FiFolder className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-xs text-[var(--text-secondary)]">Categorias</p>
                  <p className="text-xl font-bold text-[var(--text-primary)]">{categorias.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-[var(--bg-card)] p-3 rounded-lg border border-[var(--border)] hover:border-violet-500/40 transition-colors">
              <div className="flex items-center gap-2.5">
                <FiEdit3 className="h-5 w-5 text-violet-600" />
                <div>
                  <p className="text-xs text-[var(--text-secondary)]">Markdown</p>
                  <p className="text-xl font-bold text-[var(--text-primary)]">{totalMarkdown}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Notas Recentes */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-2.5">
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">Notas Recentes</h2>
              <Link
                to="/notes"
                className="text-xs font-medium text-violet-400 hover:text-violet-300 transition-colors"
              >
                Ver todas
              </Link>
            </div>
            <div className="space-y-2">
              {notasRecentes.length > 0 ? (
                notasRecentes.map((nota) => (
                  <Link
                    key={nota.id}
                    to={`/notes/${nota.id}`}
                    className="block bg-[var(--bg-card)] p-3 rounded-lg border border-[var(--border)] hover:border-violet-500/40 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-[var(--text-primary)]">
                          {nota.titulo}
                        </h3>
                        <div className="flex items-center mt-1.5 gap-1.5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            nota.tipo === 'MARKDOWN' 
                              ? 'bg-violet-100 text-violet-700' 
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {nota.tipo}
                          </span>
                          <span className="text-xs text-[var(--text-secondary)]">
                            {new Date(nota.atualizado_em).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="bg-[var(--bg-card)] p-6 rounded-lg border border-[var(--border)] text-center">
                  <FiFileText className="h-6 w-6 text-[var(--text-muted)] mx-auto mb-3" />
                  <p className="text-xs text-[var(--text-secondary)] mb-3">Nenhuma nota ainda</p>
                  <Link
                    to="/notes/new"
                    className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors"
                  >
                    <FiPlus className="h-3.5 w-3.5" />
                    Criar primeira nota
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Categorias */}
          <div>
            <div className="flex justify-between items-center mb-2.5">
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">Categorias</h2>
              <button className="text-xs font-medium text-violet-400 hover:text-violet-300 transition-colors">
                Nova
              </button>
            </div>
            <div className="space-y-1.5">
              {categorias.length > 0 ? (
                categorias.map((categoria) => (
                  <div
                    key={categoria.id}
                    className="bg-[var(--bg-card)] p-2.5 rounded-lg border border-[var(--border)] flex items-center justify-between hover:border-violet-500/40 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-6 h-6 bg-emerald-100 rounded-md">
                        <FiFolder className="h-3.5 w-3.5 text-emerald-600" />
                      </div>
                      <span className="text-xs font-medium text-[var(--text-primary)]">
                        {categoria.nome}
                      </span>
                    </div>
                    <span className="text-[10px] text-[var(--text-muted)] bg-[var(--bg-hover)] px-1.5 py-0.5 rounded-full">
                      {categoria._count?.notas || 0}
                    </span>
                  </div>
                ))
              ) : (
                <div className="bg-[var(--bg-card)] p-4 rounded-lg border border-[var(--border)] text-center">
                  <FiFolder className="h-5 w-5 text-[var(--text-muted)] mx-auto mb-2" />
                  <p className="text-xs text-[var(--text-secondary)]">Nenhuma categoria</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      </div>
    </div>
  )
}
