import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiPlus, FiSearch, FiFileText, FiCalendar, FiFilter } from 'react-icons/fi'
import { useNotasStore } from '../store/useNotasStore'
import { Sidebar } from '../components/Sidebar'

export function NotesListPage() {
  const { notas, categorias, loadNotas, loadCategorias, isLoading } = useNotasStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategoria, setFilterCategoria] = useState<string>('all')

  useEffect(() => {
    loadNotas()
    loadCategorias()
  }, [loadNotas, loadCategorias])

  const notasFiltradas = notas.filter(nota => {
    const matchSearch = nota.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       nota.conteudo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCategoria = filterCategoria === 'all' || nota.categoria_id === filterCategoria
    return matchSearch && matchCategoria
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="h-12 w-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[var(--bg-app)] text-[var(--text-primary)]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-12 bg-[var(--bg-card)]/80 backdrop-blur-sm border-b border-[var(--border)] sticky top-0 z-40">
          <div className="h-full px-3 sm:px-4 lg:px-6">
            <div className="flex justify-between items-center h-full">
              <h2 className="text-base font-semibold text-[var(--text-primary)]">Todas as Notas</h2>
              <Link
                to="/notes/new"
                className="h-8 px-3 inline-flex items-center gap-1.5 text-xs font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors"
              >
                <FiPlus className="h-3.5 w-3.5" />
                Nova Nota
              </Link>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-3 sm:px-4 lg:px-6 py-5">
          <div className="max-w-7xl mx-auto">
            {/* Filtros */}
            <div className="mb-5 flex flex-col sm:flex-row gap-3">
              {/* Busca */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-4 w-4 text-[var(--text-muted)]" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar notas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-8 w-full pl-9 pr-3 text-xs bg-[var(--bg-card)] border border-[var(--border)] rounded-lg placeholder:text-[var(--text-muted)] text-[var(--text-primary)] focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-colors"
                />
              </div>

              {/* Filtro por categoria */}
              <div className="relative w-full sm:w-56">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiFilter className="h-4 w-4 text-[var(--text-muted)]" />
                </div>
                <select
                  value={filterCategoria}
                  onChange={(e) => setFilterCategoria(e.target.value)}
                  className="h-8 pl-9 pr-7 text-xs bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-colors appearance-none"
                >
                  <option value="all">Todas as categorias</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Lista de notas */}
            {notasFiltradas.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {notasFiltradas.map((nota) => (
                  <Link
                    key={nota.id}
                    to={`/notes/${nota.id}`}
                    className="block bg-[var(--bg-card)] p-4 rounded-lg border border-[var(--border)] hover:border-violet-500/40 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-violet-400 transition-colors line-clamp-2">
                        {nota.titulo}
                      </h3>
                    </div>

                    {/* Preview do conteúdo */}
                    <p className="text-xs text-[var(--text-secondary)] line-clamp-3 mb-3">
                      {nota.conteudo.substring(0, 140)}
                      {nota.conteudo.length > 140 && '...'}
                    </p>

                    {/* Meta info */}
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        nota.tipo === 'MARKDOWN'
                          ? 'bg-violet-100 text-violet-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {nota.tipo}
                      </span>
                      <div className="flex items-center gap-1 text-[10px] text-[var(--text-muted)]">
                        <FiCalendar className="h-3 w-3" />
                        {new Date(nota.atualizado_em).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-[var(--bg-card)] p-8 rounded-lg border border-[var(--border)] text-center">
                <FiFileText className="h-6 w-6 text-[var(--text-muted)] mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1.5">
                  {searchTerm || filterCategoria !== 'all'
                    ? 'Nenhuma nota encontrada'
                    : 'Nenhuma nota ainda'}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mb-4">
                  {searchTerm || filterCategoria !== 'all'
                    ? 'Tente ajustar os filtros de busca'
                    : 'Comece criando sua primeira nota'}
                </p>
                {!searchTerm && filterCategoria === 'all' && (
                  <Link
                    to="/notes/new"
                    className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors"
                  >
                    <FiPlus className="h-3.5 w-3.5" />
                    Criar primeira nota
                  </Link>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
