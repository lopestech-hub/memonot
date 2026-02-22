import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FiSave, FiEdit3, FiEye, FiTrash2, FiDownload } from 'react-icons/fi'
import MDEditor from '@uiw/react-md-editor'
import { useNotasStore } from '../store/useNotasStore'
import { useAuthStore } from '../store/useAuthStore'
import { Sidebar } from '../components/Sidebar'
import { exportAsMarkdown, exportAsHTML, exportAsText } from '../utils/exportNote'

export function NotesPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = id === 'new'
  
  const [titulo, setTitulo] = useState('')
  const [conteudo, setConteudo] = useState('')
  const [tipo, setTipo] = useState<'TEXTO' | 'MARKDOWN'>('MARKDOWN')
  const [isPreview, setIsPreview] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)
  
  const { 
    notaAtual, 
    createNota, 
    updateNota, 
    deleteNota, 
    setNotaAtual,
    isLoading,
    error 
  } = useNotasStore()
  
  const { user } = useAuthStore()

  // Carregar nota se não for nova
  useEffect(() => {
    if (!isNew && id) {
      // Se já temos a nota carregada, usa ela
      if (notaAtual?.id === id) {
        setTitulo(notaAtual.titulo)
        setConteudo(notaAtual.conteudo)
        setTipo(notaAtual.tipo)
      } else {
        // Senão, carrega do store
        const notasFromStore = useNotasStore.getState().notas
        const nota = notasFromStore.find(n => n.id === id)
        if (nota) {
          setNotaAtual(nota)
          setTitulo(nota.titulo)
          setConteudo(nota.conteudo)
          setTipo(nota.tipo)
        }
      }
    }
  }, [id, isNew, notaAtual, setNotaAtual])

  // Auto-save a cada 2 segundos se houver mudanças
  useEffect(() => {
    if (!hasUnsavedChanges || !titulo.trim()) return

    const timeoutId = setTimeout(async () => {
      await handleSave(false) // false = não mostrar feedback
    }, 2000)

    return () => clearTimeout(timeoutId)
  }, [titulo, conteudo, tipo, hasUnsavedChanges])

  // Detectar mudanças
  useEffect(() => {
    if (isNew) return
    
    const hasChanges = 
      titulo !== notaAtual?.titulo ||
      conteudo !== notaAtual?.conteudo ||
      tipo !== notaAtual?.tipo
    
    setHasUnsavedChanges(hasChanges)
  }, [titulo, conteudo, tipo, notaAtual, isNew])

  const handleSave = async (showFeedback = true) => {
    if (!titulo.trim()) {
      if (showFeedback) {
        alert('O título é obrigatório')
      }
      return
    }

    try {
      if (isNew) {
        const newNota = await createNota({
          titulo: titulo.trim(),
          conteudo,
          tipo,
          usuario_id: user!.id,
        })
        if (newNota) {
          navigate(`/notes/${newNota.id}`, { replace: true })
        }
      } else {
        await updateNota(id!, {
          titulo: titulo.trim(),
          conteudo,
          tipo,
        })
      }
      
      setLastSaved(new Date())
      setHasUnsavedChanges(false)
    } catch (error) {
      console.error('Erro ao salvar:', error)
      if (showFeedback) {
        alert('Erro ao salvar nota')
      }
    }
  }

  const handleExport = (format: 'markdown' | 'html' | 'text') => {
    if (!titulo.trim()) {
      alert('Adicione um título antes de exportar')
      return
    }
    
    switch (format) {
      case 'markdown':
        exportAsMarkdown(titulo, conteudo)
        break
      case 'html':
        exportAsHTML(titulo, conteudo)
        break
      case 'text':
        exportAsText(titulo, conteudo)
        break
    }
    setShowExportMenu(false)
  }

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja deletar esta nota?')) return
    
    try {
      await deleteNota(id!)
      navigate('/dashboard')
    } catch (error) {
      console.error('Erro ao deletar:', error)
      alert('Erro ao deletar nota')
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    // Ctrl+S ou Cmd+S para salvar
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault()
      handleSave()
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (isLoading && !isNew) {
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
        <header className="h-12 bg-[var(--bg-card)]/85 backdrop-blur-sm border-b border-[var(--border)] sticky top-0 z-40">
          <div className="h-full px-3 sm:px-4 lg:px-6">
            <div className="flex justify-between items-center h-full gap-3">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="text-[10px] uppercase tracking-wide text-[var(--text-muted)]">Nota</div>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Título da nota..."
                  className="flex-1 min-w-0 text-base font-semibold bg-transparent border-none outline-none text-[var(--text-primary)] placeholder-[var(--text-muted)]"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1.5 text-[11px]">
                  {hasUnsavedChanges && (
                    <span className="text-amber-400 border border-amber-300/60 px-2 py-0.5 rounded-full">Não salvo</span>
                  )}
                  {lastSaved && !hasUnsavedChanges && (
                    <span className="text-emerald-400 border border-emerald-300/60 px-2 py-0.5 rounded-full">
                      Salvo {lastSaved.toLocaleTimeString('pt-BR')}
                    </span>
                  )}
                </div>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value as 'TEXTO' | 'MARKDOWN')}
                  className="h-8 px-2.5 text-xs bg-[var(--bg-card)] border border-[var(--border)] rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-colors"
                >
                  <option value="TEXTO">Texto</option>
                  <option value="MARKDOWN">Markdown</option>
                </select>
                {tipo === 'MARKDOWN' && (
                  <button
                    onClick={() => setIsPreview(!isPreview)}
                    className={`h-8 w-8 flex items-center justify-center rounded-lg transition-colors ${
                      isPreview
                        ? 'border border-violet-500/40 text-violet-400'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
                    }`}
                    title={isPreview ? 'Editar' : 'Preview'}
                  >
                    {isPreview ? <FiEdit3 className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                  </button>
                )}
                <button
                  onClick={() => handleSave()}
                  disabled={isLoading || !titulo.trim()}
                  className="h-8 px-3 inline-flex items-center gap-1.5 text-xs font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <FiSave className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline">{isLoading ? 'Salvando' : 'Salvar'}</span>
                </button>
                {!isNew && (
                  <>
                    <div className="relative">
                      <button
                        onClick={() => setShowExportMenu(!showExportMenu)}
                        className="h-8 w-8 flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] rounded-lg transition-colors"
                        title="Exportar nota"
                      >
                        <FiDownload className="h-4 w-4" />
                      </button>
                      {showExportMenu && (
                        <div className="absolute right-0 top-full mt-1 w-40 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg shadow-lg py-1 z-50">
                          <button
                            onClick={() => handleExport('markdown')}
                            className="w-full px-3 py-1.5 text-left text-xs text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
                          >
                            Markdown (.md)
                          </button>
                          <button
                            onClick={() => handleExport('html')}
                            className="w-full px-3 py-1.5 text-left text-xs text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
                          >
                            HTML (.html)
                          </button>
                          <button
                            onClick={() => handleExport('text')}
                            className="w-full px-3 py-1.5 text-left text-xs text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
                          >
                            Texto (.txt)
                          </button>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={handleDelete}
                      className="h-8 w-8 flex items-center justify-center text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors"
                      title="Deletar nota"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

      {/* Error message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        </div>
      )}

      {/* Conteúdo */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] overflow-hidden">
          {tipo === 'MARKDOWN' ? (
            <div className="h-[calc(100vh-12rem)]">
              <MDEditor
                value={conteudo}
                onChange={(val) => setConteudo(val || '')}
                preview={isPreview ? 'preview' : 'edit'}
                hideToolbar={false}
                height="100%"
              />
            </div>
          ) : (
            <textarea
              value={conteudo}
              onChange={(e) => setConteudo(e.target.value)}
              placeholder="Digite sua nota aqui..."
              className="w-full h-[calc(100vh-12rem)] p-6 border-none outline-none resize-none text-[var(--text-primary)] placeholder-[var(--text-muted)] bg-[var(--bg-card)] text-base"
            />
          )}
        </div>
      </main>
      </div>
    </div>
  )
}
