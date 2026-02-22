import { FastifyRequest } from 'fastify'

declare module 'fastify' {
  export interface FastifyInstance {
    authenticate(request: FastifyRequest): Promise<void>
  }

  export interface FastifyRequest {
    user: {
      sub: string
      email: string
    }
  }
}
