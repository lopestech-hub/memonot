# ─── Stage 1: Build do Frontend ───────────────────────────────
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

# ─── Stage 2: Build do Backend ────────────────────────────────
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ .
RUN npm run build
RUN npx prisma generate

# ─── Stage 3: Imagem Final ────────────────────────────────────
FROM node:20-alpine
ENV TZ=America/Sao_Paulo
WORKDIR /app

# Instalar OpenSSL e dependências necessárias para Prisma
RUN apk add --no-cache openssl openssl-dev libc6-compat

# Copiar arquivos do backend
COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=backend-builder /app/backend/node_modules ./node_modules
COPY --from=backend-builder /app/backend/package.json ./
COPY --from=backend-builder /app/backend/prisma ./prisma

# Regenerar Prisma Client para a arquitetura correta
RUN npx prisma generate

# Copiar build do frontend
COPY --from=frontend-builder /app/frontend/dist ./public

EXPOSE 3000
CMD ["node", "dist/main.js"]
