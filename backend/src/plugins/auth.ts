import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify'
import '@fastify/jwt'

export const authPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorate('authenticate', async function(request: FastifyRequest, reply: FastifyReply) {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
  })
}
