import { FastifyPluginAsync } from 'fastify'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { authenticate } from '../plugins/auth'

const registerSchema = z.object({
  nome: z.string().min(2),
  email: z.string().email(),
  senha: z.string().min(6),
})

const loginSchema = z.object({
  email: z.string().email(),
  senha: z.string(),
})

export const authRoutes: FastifyPluginAsync = async (fastify) => {
  // Registro
  fastify.post('/registro', async (request, reply) => {
    try {
      const body = registerSchema.parse(request.body)
      
      // Verificar se email já existe
      const usuarioExistente = await prisma.usuario.findUnique({
        where: { email: body.email }
      })
      
      if (usuarioExistente) {
        return reply.status(400).send({
          success: false,
          error: 'Email já cadastrado',
        })
      }
      
      const hashedPassword = await bcrypt.hash(body.senha, 10)
      
      const usuario = await prisma.usuario.create({
        data: {
          nome: body.nome,
          email: body.email,
          senha: hashedPassword,
        }
      })
      
      return reply.status(201).send({
        success: true,
        message: 'Usuário criado com sucesso',
        user: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
        }
      })
    } catch (error) {
      console.error('Erro no registro:', error)
      return reply.status(400).send({
        success: false,
        error: 'Dados inválidos',
      })
    }
  })

  // Login
  fastify.post('/login', async (request, reply) => {
    try {
      const body = loginSchema.parse(request.body)
      
      const usuario = await prisma.usuario.findUnique({
        where: { email: body.email }
      })
      
      if (!usuario || !usuario.senha) {
        return reply.status(401).send({
          success: false,
          error: 'Credenciais inválidas',
        })
      }
      
      const senhaValida = await bcrypt.compare(body.senha, usuario.senha)
      
      if (!senhaValida) {
        return reply.status(401).send({
          success: false,
          error: 'Credenciais inválidas',
        })
      }
      
      const token = fastify.jwt.sign({
        sub: usuario.id,
        email: usuario.email,
      })
      
      return reply.send({
        success: true,
        token,
        user: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
        },
      })
    } catch (error) {
      console.error('Erro no login:', error)
      return reply.status(400).send({
        success: false,
        error: 'Credenciais inválidas',
      })
    }
  })

  // Refresh token
  fastify.post('/refresh', async (request, reply) => {
    try {
      // TODO: Implementar refresh token
      return reply.send({
        success: true,
        token: 'new-token',
      })
    } catch (error) {
      return reply.status(401).send({
        success: false,
        error: 'Token inválido',
      })
    }
  })

  // Perfil do usuário
  fastify.get('/eu', {
    onRequest: [authenticate],
  }, async (request, reply) => {
    try {
      const userId = (request.user as any).sub
      
      const usuario = await prisma.usuario.findUnique({
        where: { id: userId },
        select: {
          id: true,
          nome: true,
          email: true,
          criado_em: true,
        }
      })
      
      if (!usuario) {
        return reply.status(404).send({
          success: false,
          error: 'Usuário não encontrado',
        })
      }
      
      return reply.send({
        success: true,
        user: usuario,
      })
    } catch (error) {
      console.error('Erro ao buscar perfil:', error)
      return reply.status(500).send({
        success: false,
        error: 'Erro ao buscar perfil',
      })
    }
  })
}
