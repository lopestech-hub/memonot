import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiMail, FiLock, FiUser, FiUserPlus, FiEdit3 } from 'react-icons/fi'
import { useAuthStore } from '../store/useAuthStore'

export function RegisterPage() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [error, setError] = useState('')
  
  const { register, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (senha !== confirmarSenha) {
      setError('As senhas não coincidem')
      return
    }
    
    if (senha.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres')
      return
    }
    
    const result = await register(nome, email, senha)
    
    if (result.success) {
      alert('Conta criada com sucesso! Faça login para continuar.')
      navigate('/login')
    } else {
      setError(result.error || 'Erro ao criar conta')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-violet-100 rounded-2xl mb-4">
            <FiEdit3 className="h-8 w-8 text-violet-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">
            Criar Conta
          </h1>
          <p className="mt-2 text-slate-600">
            Junte-se ao MemoNot
          </p>
        </div>
        
        {/* Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
        
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Nome */}
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-slate-700 mb-1.5">
                Nome
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  required
                  minLength={2}
                  className="h-10 w-full pl-10 pr-3 text-sm bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-colors"
                  placeholder="Seu nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="h-10 w-full pl-10 pr-3 text-sm bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-colors"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-slate-700 mb-1.5">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="senha"
                  name="senha"
                  type="password"
                  required
                  minLength={6}
                  className="h-10 w-full pl-10 pr-3 text-sm bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-colors"
                  placeholder="Mínimo 6 caracteres"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
              </div>
            </div>

            {/* Confirmar Senha */}
            <div>
              <label htmlFor="confirmarSenha" className="block text-sm font-medium text-slate-700 mb-1.5">
                Confirmar Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="confirmarSenha"
                  name="confirmarSenha"
                  type="password"
                  required
                  className="h-10 w-full pl-10 pr-3 text-sm bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-colors"
                  placeholder="Repita a senha"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                />
              </div>
            </div>

            {/* Botão Criar Conta */}
            <button
              type="submit"
              disabled={isLoading}
              className="h-10 w-full flex items-center justify-center gap-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <FiUserPlus className="h-4 w-4" />
                  Criar Conta
                </>
              )}
            </button>
          </form>

          {/* Link para login */}
          <p className="mt-6 text-center text-sm text-slate-600">
            Já tem uma conta?{' '}
            <Link
              to="/login"
              className="font-medium text-violet-600 hover:text-violet-700 transition-colors"
            >
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
