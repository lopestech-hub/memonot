import { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { authenticate } from '../plugins/auth'

const createNoteSchema = z.object({
  titulo: z.string().min(1),
  conteudo: z.string(),
  tipo: z.enum(['TEXTO', 'MARKDOWN']).default('TEXTO'),
  categoria_id: z.string().optional(),
})

const updateNoteSchema = createNoteSchema.partial()

export const notesRoutes: FastifyPluginAsync = async (fastify) => {
  // Listar notas do usuário
  fastify.get('/', {
    onRequest: [authenticate],
  }, async (request, reply) => {
    try {
      const userId = (request.user as any).sub
      
      const notas = await prisma.nota.findMany({
        where: {
          usuario_id: userId,
          deletado_em: null,
        },
        include: {
          categoria: {
            select: {
              id: true,
              nome: true,
            }
          }
        },
        orderBy: {
          atualizado_em: 'desc',
        }
      })
      
      return reply.send({
        success: true,
        data: notas,
      })
    } catch (error) {
      console.error('Erro ao listar notas:', error)
      return reply.status(500).send({
        success: false,
        error: 'Erro ao buscar notas',
      })
    }
  })

  // Criar nova nota
  fastify.post('/', {
    onRequest: [authenticate],
  }, async (request, reply) => {
    try {
      const body = createNoteSchema.parse(request.body)
      const userId = (request.user as any).sub
      
      // Verificar se categoria pertence ao usuário
      if (body.categoria_id) {
        const categoria = await prisma.categoria.findFirst({
          where: {
            id: body.categoria_id,
            usuario_id: userId,
            deletado_em: null,
          }
        })
        
        if (!categoria) {
          return reply.status(400).send({
            success: false,
            error: 'Categoria não encontrada',
          })
        }
      }
      
      const newNote = await prisma.nota.create({
        data: {
          ...body,
          usuario_id: userId,
        },
        include: {
          categoria: {
            select: {
              id: true,
              nome: true,
            }
          }
        }
      })
      
      return reply.status(201).send({
        success: true,
        data: newNote,
      })
    } catch (error) {
      console.error('Erro ao criar nota:', error)
      return reply.status(400).send({
        success: false,
        error: 'Dados inválidos',
      })
    }
  })

  // Buscar nota específica
  fastify.get('/:id', {
    onRequest: [authenticate],
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const userId = (request.user as any).sub
      
      const nota = await prisma.nota.findFirst({
        where: {
          id,
          usuario_id: userId,
          deletado_em: null,
        },
        include: {
          categoria: {
            select: {
              id: true,
              nome: true,
            }
          }
        }
      })
      
      if (!nota) {
        return reply.status(404).send({
          success: false,
          error: 'Nota não encontrada',
        })
      }
      
      return reply.send({
        success: true,
        data: nota,
      })
    } catch (error) {
      console.error('Erro ao buscar nota:', error)
      return reply.status(500).send({
        success: false,
        error: 'Erro ao buscar nota',
      })
    }
  })

  // Atualizar nota
  fastify.put('/:id', {
    onRequest: [authenticate],
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const userId = (request.user as any).sub
      const body = updateNoteSchema.parse(request.body)
      
      // Verificar se a nota pertence ao usuário
      const notaExistente = await prisma.nota.findFirst({
        where: {
          id,
          usuario_id: userId,
          deletado_em: null,
        }
      })
      
      if (!notaExistente) {
        return reply.status(404).send({
          success: false,
          error: 'Nota não encontrada',
        })
      }
      
      // Atualizar nota
      await prisma.nota.update({
        where: { id },
        data: body,
      })
      
      return reply.send({
        success: true,
        message: 'Nota atualizada com sucesso',
      })
    } catch (error) {
      console.error('Erro ao atualizar nota:', error)
      return reply.status(400).send({
        success: false,
        error: 'Dados inválidos',
      })
    }
  })

  // Deletar nota (soft delete)
  fastify.delete('/:id', {
    onRequest: [authenticate],
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const userId = (request.user as any).sub
      
      // Verificar se a nota pertence ao usuário
      const notaExistente = await prisma.nota.findFirst({
        where: {
          id,
          usuario_id: userId,
          deletado_em: null,
        }
      })
      
      if (!notaExistente) {
        return reply.status(404).send({
          success: false,
          error: 'Nota não encontrada',
        })
      }
      
      // Soft delete
      await prisma.nota.update({
        where: { id },
        data: {
          deletado_em: new Date(),
        }
      })
      
      return reply.send({
        success: true,
        message: 'Nota deletada com sucesso',
      })
    } catch (error) {
      console.error('Erro ao deletar nota:', error)
      return reply.status(500).send({
        success: false,
        error: 'Erro ao deletar nota',
      })
    }
  })

  // Buscar notas
  fastify.get('/busca', {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    try {
      const { q } = request.query as { q?: string }
      const userId = (request.user as any).sub
      
      if (!q) {
        return reply.status(400).send({
          success: false,
          error: 'Termo de busca obrigatório',
        })
      }
      
      // Buscar notas por título ou conteúdo
      const notas = await prisma.nota.findMany({
        where: {
          usuario_id: userId,
          deletado_em: null,
          OR: [
            {
              titulo: {
                contains: q,
                mode: 'insensitive',
              }
            },
            {
              conteudo: {
                contains: q,
                mode: 'insensitive',
              }
            }
          ]
        },
        include: {
          categoria: {
            select: {
              id: true,
              nome: true,
            }
          }
        },
        orderBy: {
          atualizado_em: 'desc',
        }
      })
      
      return reply.send({
        success: true,
        data: notas,
      })
    } catch (error) {
      console.error('Erro na busca:', error)
      return reply.status(500).send({
        success: false,
        error: 'Erro na busca',
      })
    }
  })
}
