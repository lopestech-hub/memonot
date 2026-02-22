import { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

const createCategorySchema = z.object({
  nome: z.string().min(1),
})

const updateCategorySchema = createCategorySchema.partial()

export const categoriesRoutes: FastifyPluginAsync = async (fastify) => {
  // Listar categorias do usuário
  fastify.get('/', {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    try {
      const userId = (request.user as any).sub
      
      const categorias = await prisma.categoria.findMany({
        where: {
          usuario_id: userId,
          deletado_em: null,
        },
        include: {
          _count: {
            select: {
              notas: {
                where: {
                  deletado_em: null,
                }
              }
            }
          }
        },
        orderBy: {
          nome: 'asc',
        }
      })
      
      return reply.send({
        success: true,
        data: categorias,
      })
    } catch (error) {
      console.error('Erro ao buscar categorias:', error)
      return reply.status(500).send({
        success: false,
        error: 'Erro ao buscar categorias',
      })
    }
  })

  // Criar nova categoria
  fastify.post('/', {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    try {
      const body = createCategorySchema.parse(request.body)
      const userId = (request.user as any).sub
      
      const newCategory = await prisma.categoria.create({
        data: {
          nome: body.nome,
          usuario_id: userId,
        },
        include: {
          _count: {
            select: {
              notas: true
            }
          }
        }
      })
      
      return reply.status(201).send({
        success: true,
        data: newCategory,
      })
    } catch (error) {
      console.error('Erro ao criar categoria:', error)
      return reply.status(400).send({
        success: false,
        error: 'Dados inválidos',
      })
    }
  })

  // Atualizar categoria
  fastify.put('/:id', {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const userId = (request.user as any).sub
      const body = updateCategorySchema.parse(request.body)
      
      // Verificar se a categoria pertence ao usuário
      const categoriaExistente = await prisma.categoria.findFirst({
        where: {
          id,
          usuario_id: userId,
          deletado_em: null,
        }
      })
      
      if (!categoriaExistente) {
        return reply.status(404).send({
          success: false,
          error: 'Categoria não encontrada',
        })
      }
      
      // Atualizar categoria
      await prisma.categoria.update({
        where: { id },
        data: body,
      })
      
      return reply.send({
        success: true,
        message: 'Categoria atualizada com sucesso',
      })
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error)
      return reply.status(400).send({
        success: false,
        error: 'Dados inválidos',
      })
    }
  })

  // Deletar categoria (soft delete)
  fastify.delete('/:id', {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const userId = (request.user as any).sub
      
      // Verificar se a categoria pertence ao usuário
      const categoriaExistente = await prisma.categoria.findFirst({
        where: {
          id,
          usuario_id: userId,
          deletado_em: null,
        }
      })
      
      if (!categoriaExistente) {
        return reply.status(404).send({
          success: false,
          error: 'Categoria não encontrada',
        })
      }
      
      // Soft delete
      await prisma.categoria.update({
        where: { id },
        data: {
          deletado_em: new Date(),
        }
      })
      
      return reply.send({
        success: true,
        message: 'Categoria deletada com sucesso',
      })
    } catch (error) {
      console.error('Erro ao deletar categoria:', error)
      return reply.status(500).send({
        success: false,
        error: 'Erro ao deletar categoria',
      })
    }
  })
}
