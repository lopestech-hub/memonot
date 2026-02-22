import { FastifyRequest, FastifyReply } from 'fastify'
import '@fastify/jwt'

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()
  } catch (err) {
    reply.send(err)
  }
}
