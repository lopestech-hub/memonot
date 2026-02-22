import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { authRoutes } from './routes/auth'
import { notesRoutes } from './routes/notes'
import { categoriesRoutes } from './routes/categories'

const fastify = Fastify({
  logger: true,
})

// Registrar plugins
fastify.register(cors, {
  origin: true,
  credentials: true,
})

fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'seu-segredo-aqui',
})

// Registrar rotas
fastify.register(authRoutes, { prefix: '/auth' })
fastify.register(notesRoutes, { prefix: '/notas' })
fastify.register(categoriesRoutes, { prefix: '/categorias' })

// Rota de saúde
fastify.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() }
})

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3000
    await fastify.listen({ port, host: '0.0.0.0' })
    console.log(`🚀 Servidor rodando em http://localhost:${port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
