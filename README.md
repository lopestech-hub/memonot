# MemoNot

Aplicativo desktop de notas com suporte a Markdown.

## 🚀 Stack Tecnológica

- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Backend**: Fastify + Prisma + PostgreSQL
- **Desktop**: Electron
- **Autenticação**: JWT

## 📁 Estrutura do Projeto

```
MemoNot/
├── frontend/          # App React
├── backend/           # API Fastify
├── Dockerfile         # Build único
├── .env.example       # Variáveis de ambiente
└── CONTEXTO.MD        # Memória do projeto
```

## 🛠️ Desenvolvimento

### Pré-requisitos
- Node.js 20+
- PostgreSQL
- Docker (opcional)

### Setup do Backend
```bash
cd backend
npm install
cp ../.env.example .env
# Configure seu DATABASE_URL
npx prisma generate
npx prisma db push
npm run dev
```

### Setup do Frontend
```bash
cd frontend
npm install
npm run dev
```

### Build com Docker
```bash
docker build -t memonot .
docker run -p 3000:3000 --env-file .env memonot
```

## 📋 Funcionalidades

- ✅ Multi-usuário com isolamento de dados
- ✅ Notas em texto normal e Markdown
- ✅ Preview em tempo real do Markdown
- ✅ Categorias para organização
- ✅ Busca textual
- ✅ Interface desktop

## 🗄️ Banco de Dados

O schema usa nomes em Português e segue os padrões:
- IDs UUID automáticos
- Timestamps (criado_em, atualizado_em)
- Soft delete (deletado_em)
- Timezone America/Sao_Paulo

Veja o schema completo em `backend/prisma/schema.prisma`.

## 📝 Desenvolvimento

Este projeto segue as regras definidas em `.windsurf/rules/regras-trabalho.md` e utiliza o `CONTEXTO.MD` como memória viva do projeto.
