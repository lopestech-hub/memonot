import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para adicionar token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export interface User {
  id: string
  nome: string
  email: string
}

export interface Nota {
  id: string
  titulo: string
  conteudo: string
  tipo: 'TEXTO' | 'MARKDOWN'
  categoria_id?: string
  usuario_id: string
  criado_em: string
  atualizado_em: string
  deletado_em?: string
  categoria?: {
    id: string
    nome: string
  }
}

export interface Categoria {
  id: string
  nome: string
  usuario_id: string
  criado_em: string
  atualizado_em: string
  deletado_em?: string
  _count?: {
    notas: number
  }
}

// Auth API
export const authAPI = {
  login: async (email: string, senha: string) => {
    const response = await api.post('/auth/login', { email, senha })
    return response.data
  },

  register: async (nome: string, email: string, senha: string) => {
    const response = await api.post('/auth/registro', { nome, email, senha })
    return response.data
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get('/auth/eu')
    return response.data.user
  },
}

// Notas API
export const notasAPI = {
  list: async (): Promise<Nota[]> => {
    const response = await api.get('/notas')
    return response.data.data
  },

  get: async (id: string): Promise<Nota> => {
    const response = await api.get(`/notas/${id}`)
    return response.data.data
  },

  create: async (data: Partial<Nota>): Promise<Nota> => {
    const response = await api.post('/notas', data)
    return response.data.data
  },

  update: async (id: string, data: Partial<Nota>): Promise<void> => {
    await api.put(`/notas/${id}`, data)
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/notas/${id}`)
  },

  search: async (query: string): Promise<Nota[]> => {
    const response = await api.get(`/notas/busca?q=${encodeURIComponent(query)}`)
    return response.data.data
  },
}

// Categorias API
export const categoriasAPI = {
  list: async (): Promise<Categoria[]> => {
    const response = await api.get('/categorias')
    return response.data.data
  },

  create: async (data: Partial<Categoria>): Promise<Categoria> => {
    const response = await api.post('/categorias', data)
    return response.data.data
  },

  update: async (id: string, data: Partial<Categoria>): Promise<void> => {
    await api.put(`/categorias/${id}`, data)
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/categorias/${id}`)
  },
}
