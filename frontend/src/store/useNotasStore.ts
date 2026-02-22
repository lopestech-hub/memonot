import { create } from 'zustand'
import { Nota, Categoria, notasAPI, categoriasAPI } from '../lib/api'

interface NotasState {
  notas: Nota[]
  categorias: Categoria[]
  notaAtual: Nota | null
  isLoading: boolean
  error: string | null
  
  // Notas
  loadNotas: () => Promise<void>
  loadNota: (id: string) => Promise<void>
  createNota: (data: Partial<Nota>) => Promise<Nota | null>
  updateNota: (id: string, data: Partial<Nota>) => Promise<void>
  deleteNota: (id: string) => Promise<void>
  searchNotas: (query: string) => Promise<void>
  setNotaAtual: (nota: Nota | null) => void
  
  // Categorias
  loadCategorias: () => Promise<void>
  createCategoria: (data: Partial<Categoria>) => Promise<void>
  updateCategoria: (id: string, data: Partial<Categoria>) => Promise<void>
  deleteCategoria: (id: string) => Promise<void>
  
  // Utils
  clearError: () => void
}

export const useNotasStore = create<NotasState>((set) => ({
  notas: [],
  categorias: [],
  notaAtual: null,
  isLoading: false,
  error: null,

  loadNotas: async () => {
    set({ isLoading: true, error: null })
    try {
      const notas = await notasAPI.list()
      set({ notas, isLoading: false })
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Erro ao carregar notas',
        isLoading: false 
      })
    }
  },

  loadNota: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const nota = await notasAPI.get(id)
      set({ notaAtual: nota, isLoading: false })
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Erro ao carregar nota',
        isLoading: false 
      })
    }
  },

  createNota: async (data: Partial<Nota>): Promise<Nota | null> => {
    set({ isLoading: true, error: null })
    try {
      const newNota = await notasAPI.create(data)
      set(state => ({ 
        notas: [newNota, ...state.notas],
        isLoading: false 
      }))
      return newNota
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Erro ao criar nota',
        isLoading: false 
      })
      return null
    }
  },

  updateNota: async (id: string, data: Partial<Nota>) => {
    set({ isLoading: true, error: null })
    try {
      await notasAPI.update(id, data)
      
      // Atualizar nota na lista
      set(state => {
        const updatedNotas = state.notas.map(nota => 
          nota.id === id ? { ...nota, ...data, atualizado_em: new Date().toISOString() } : nota
        )
        
        const updatedNotaAtual = state.notaAtual?.id === id 
          ? { ...state.notaAtual, ...data, atualizado_em: new Date().toISOString() }
          : state.notaAtual
        
        return {
          notas: updatedNotas,
          notaAtual: updatedNotaAtual,
          isLoading: false
        }
      })
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Erro ao atualizar nota',
        isLoading: false 
      })
    }
  },

  deleteNota: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      await notasAPI.delete(id)
      set(state => ({
        notas: state.notas.filter(nota => nota.id !== id),
        notaAtual: state.notaAtual?.id === id ? null : state.notaAtual,
        isLoading: false
      }))
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Erro ao deletar nota',
        isLoading: false 
      })
    }
  },

  searchNotas: async (query: string) => {
    set({ isLoading: true, error: null })
    try {
      const notas = await notasAPI.search(query)
      set({ notas, isLoading: false })
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Erro na busca',
        isLoading: false 
      })
    }
  },

  setNotaAtual: (nota: Nota | null) => {
    set({ notaAtual: nota })
  },

  loadCategorias: async () => {
    set({ isLoading: true, error: null })
    try {
      const categorias = await categoriasAPI.list()
      set({ categorias, isLoading: false })
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Erro ao carregar categorias',
        isLoading: false 
      })
    }
  },

  createCategoria: async (data: Partial<Categoria>) => {
    set({ isLoading: true, error: null })
    try {
      const newCategoria = await categoriasAPI.create(data)
      set(state => ({ 
        categorias: [...state.categorias, newCategoria],
        isLoading: false 
      }))
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Erro ao criar categoria',
        isLoading: false 
      })
    }
  },

  updateCategoria: async (id: string, data: Partial<Categoria>) => {
    set({ isLoading: true, error: null })
    try {
      await categoriasAPI.update(id, data)
      set(state => ({
        categorias: state.categorias.map(cat => 
          cat.id === id ? { ...cat, ...data, atualizado_em: new Date().toISOString() } : cat
        ),
        isLoading: false
      }))
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Erro ao atualizar categoria',
        isLoading: false 
      })
    }
  },

  deleteCategoria: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      await categoriasAPI.delete(id)
      set(state => ({
        categorias: state.categorias.filter(cat => cat.id !== id),
        isLoading: false
      }))
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Erro ao deletar categoria',
        isLoading: false 
      })
    }
  },

  clearError: () => {
    set({ error: null })
  },
}))
