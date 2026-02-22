# CONTEXTO.MD — Memória do Projeto MemoNot

> Memória viva do projeto. Atualizado automaticamente pelo Claude após qualquer mudança e obrigatoriamente antes de encerrar cada sessão.

---

## 🎯 Objetivo do Sistema
Aplicativo desktop de notas multi-usuário com suporte a texto normal e Markdown. Permite criação, edição, organização e busca de notas com preview em tempo real do Markdown.

## 👥 Usuários e Perfis
- **Usuários**: Múltiplos usuários com contas isoladas (multi-tenancy)
- **Autenticação**: Login/senha por usuário
- **Isolamento**: Cada usuário vê apenas suas próprias notas

## ⚙️ Regras de Negócio
- Multi-tenancy completo (notas isoladas por usuário)
- Suporte a texto normal e Markdown
- Preview em tempo real do Markdown
- Busca textual em todas as notas
- Organização por categorias
- Interface desktop (Electron)
- MVP: sem integrações externas, sem suporte a imagens

---

## 📦 Stack Tecnológica

### Frontend
- Framework: React + Vite + TypeScript
- Estilo: Tailwind CSS
- Ícones: react-icons
- Libs: @uiw/react-md-editor (editor Markdown), react-markdown (preview), Zustand (estado), date-fns (datas), react-hook-form + Zod (formulários)

### Backend
- Runtime: Node.js
- Framework: Fastify (leve e rápido para API)
- ORM: Prisma
- Banco: PostgreSQL
- Libs: JWT (autenticação), bcrypt (senhas)

### Autenticação
- Estratégia: JWT manual com refresh token
- Detalhes: Controle total para multi-tenancy

### MCP
- Nome do MCP do banco: **A definir** (precisa configurar)
- Usar sempre para consultas ao banco

### Infraestrutura
- Hospedagem: VPS com EasyPanel
- Deploy: Dockerfile único na raiz
- Banco: sempre na VPS, nunca local
- Desktop: Electron empacotando app web
- Timezone: America/Sao_Paulo (UTC-3)

---

## �️ Banco de Dados

### Tabelas
- **usuarios**: Contas dos usuários com autenticação
- **notas**: Conteúdo das notas (texto e Markdown)
- **categorias**: Organização das notas

### Prisma Schema Completo e Atualizado
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model usuario {
  id            String    @id @default(uuid())
  nome          String
  email         String    @unique
  senha         String
  criado_em     DateTime  @default(now())
  atualizado_em DateTime  @updatedAt
  deletado_em   DateTime?

  notas       nota[]
  categorias  categoria[]
}

model categoria {
  id            String    @id @default(uuid())
  nome          String
  usuario_id    String
  criado_em     DateTime  @default(now())
  atualizado_em DateTime  @updatedAt
  deletado_em   DateTime?

  usuario usuario @relation(fields: [usuario_id], references: [id])
  notas   nota[]
}

model nota {
  id            String    @id @default(uuid())
  titulo        String
  conteudo      String    // Texto normal ou Markdown
  tipo          tipo_nota @default(TEXTO)
  categoria_id  String?
  usuario_id    String
  criado_em     DateTime  @default(now())
  atualizado_em DateTime  @updatedAt
  deletado_em   DateTime?

  usuario   usuario   @relation(fields: [usuario_id], references: [id])
  categoria categoria? @relation(fields: [categoria_id], references: [id])
}

enum tipo_nota {
  TEXTO
  MARKDOWN
}
```

### Scripts de Migração Criados
- Nenhum ainda - banco não configurado

### Decisões Importantes
- Usamos soft delete (deletado_em) para preservar dados
- Campo tipo_nota para diferenciar texto de Markdown
- Relacionamento opcional com categorias
- Multi-tenancy via usuario_id em todas as tabelas

---

## 🔌 Rotas da API

### Autenticação
| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | /auth/registro | Criar nova conta | ❌ |
| POST | /auth/login | Login do usuário | ❌ |
| POST | /auth/refresh | Renovar token | ❌ |
| GET | /auth/eu | Perfil do usuário | ✅ |

### Notas
| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| GET | /notas | Listar notas do usuário | ✅ |
| POST | /notas | Criar nova nota | ✅ |
| GET | /notas/:id | Buscar nota específica | ✅ |
| PUT | /notas/:id | Atualizar nota | ✅ |
| DELETE | /notas/:id | Deletar nota | ✅ |
| GET | /notas/busca | Buscar textual | ✅ |

### Categorias
| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| GET | /categorias | Listar categorias | ✅ |
| POST | /categorias | Criar categoria | ✅ |
| PUT | /categorias/:id | Atualizar categoria | ✅ |
| DELETE | /categorias/:id | Deletar categoria | ✅ |

---

## 📁 Estrutura de Pastas Atual
```
MemoNot/
├── .windsurf/
│   └── rules/
│       └── regras-trabalho.md    ← Regras de trabalho configuradas
├── frontend/                     ← App React + TypeScript
│   ├── src/
│   │   ├── pages/               ← Páginas (Login, Dashboard, Notas)
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
├── backend/                      ← API Fastify + Prisma
│   ├── src/
│   │   ├── routes/              ← Rotas da API
│   │   ├── plugins/             ← Plugins Fastify
│   │   ├── types/               ← Tipos TypeScript
│   │   └── main.ts
│   ├── prisma/
│   │   └── schema.prisma        ← Schema do banco
│   ├── package.json
│   └── tsconfig.json
├── Dockerfile                    ← Build único
├── .env.example                  ← Variáveis de ambiente
├── README.md                     ← Documentação
└── CONTEXTO.MD                   ← Este arquivo (memória do projeto)
```

---

## 🔧 Variáveis de Ambiente
```env
# Banco de Dados
DATABASE_URL="postgresql://user:password@localhost:5432/memonot?schema=public"

# Timezone — OBRIGATÓRIO
TZ=America/Sao_Paulo
PGTZ=America/Sao_Paulo

# Autenticação
JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRES_IN=10h
JWT_REFRESH_EXPIRES_IN=7d

# App
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

---

## 📋 Integrações Externas
Nenhuma para MVP. Futuramente:
- Exportação PDF
- Sincronização nuvem
- Integrações com Google Drive, Notion

---

## 🚀 Roadmap

### Fase 1 — Setup e Autenticação ✅
- [x] Estrutura do projeto (frontend/backend)
- [x] Dockerfile único
- [x] Prisma e banco PostgreSQL
- [x] Autenticação JWT
- [x] Interface Electron básica

### Fase 2 — Core do Negócio
- [x] CRUD de notas (real)
- [x] Editor Markdown com preview
- [x] Categorias (real)
- [x] Busca textual
- [x] Listagem em cards/listas
- [x] Salvamento automático

### Fase 3 — Funcionalidades Avançadas ✅
- [x] Melhorias na UI/UX
- [x] Atalhos de teclado
- [x] Temas claro/escuro
- [x] Exportação de notas

### Fase 4 — Refinamentos
- [ ] Testes automatizados
- [ ] Otimizações de performance
- [ ] Empacotamento para distribuição

---

## 📝 Decisões Técnicas
- **21/02/2026**: Fastify escolhido por ser mais leve que NestJS para API simples
- **21/02/2026**: Electron para desktop em vez de app nativo (reaproveitamento web)
- **21/02/2026**: @uiw/react-md-editor para editor Markdown com preview integrado

## ⚠️ Problemas Conhecidos
Nenhum ainda - projeto em planejamento

## 📅 O que foi feito na última sessão
- **Banco de dados configurado**: PostgreSQL conectado com schema Prisma
- **Autenticação real**: JWT completo com registro, login e perfil
- **API funcional**: Rotas de auth, notas e categorias com Prisma
- **Frontend conectado**: Stores Zustand com axios e estado global
- **UI real**: Dashboard com dados dinâmicos do banco
- **Proteção de rotas**: Componente ProtectedRoute implementado
- **NotesPage completa**: CRUD real com salvamento automático a cada 2s
- **Lembrar-me**: Opção de salvar credenciais no login com localStorage
- **RegisterPage corrigida**: Agora salva usuários no banco de dados
- **Todos os mocks removidos**: Backend 100% funcional com Prisma
- **Busca textual implementada**: Busca por título e conteúdo (case-insensitive)
- **CRUD completo**: Todas as operações de notas e categorias funcionando
- **Design System Violet**: Redesign completo seguindo skill @design-engineer
- **Sidebar à esquerda**: Navegação lateral com logo, menu e categorias
- **UI/UX refinada**: Interface 20% mais compacta, ícones sem fundos, responsividade
- **Atalhos de teclado**: Ctrl+Alt+D/L/N para navegação, Ctrl+Shift+F para busca
- **Tema claro/escuro**: Toggle persistente com CSS variables, transições suaves
- **Exportação de notas**: Markdown (.md), HTML (.html) e Texto (.txt) com um clique
- **Electron Desktop**: Aplicativo nativo Windows empacotando frontend, conecta à VPS

## 🎨 Design System Aplicado
- **Direção**: Warmth & Approachability + Utility & Function
- **Cor principal**: Violet (#8b5cf6) - criatividade e foco
- **Cor secundária**: Emerald (#10b981) - categorias e sucesso
- **Neutros**: Slate (slate-50 a slate-900)
- **Tipografia**: Inter font, tamanhos reduzidos 20% (base 12.8px)
- **Componentes**: Botões h-8, inputs h-8, cards rounded-lg, borders slate-200
- **Espaçamento**: Grid reduzido 20%, gaps menores
- **Ícones**: Reduzidos 20% (h-4 w-4 padrão)
- **Transições**: 150ms ease em todos os elementos interativos
- **Arquivo**: `.design-engineer/system.md` com documentação completa
- **Densidade**: Interface mais compacta para melhor aproveitamento de espaço

## ➡️ Próximos Passos

### Deploy Backend na VPS:
1. **Criar banco PostgreSQL** no EasyPanel
2. **Configurar variáveis de ambiente** (DATABASE_URL, JWT_SECRET, etc.)
3. **Push para Git** - `git push origin main`
4. **Criar app no EasyPanel** - Conectar repositório Git
5. **Deploy automático** - EasyPanel builda com Dockerfile
6. **Rodar migrações** - `npx prisma migrate deploy`

### Electron Desktop:
1. **Instalar dependências** - `cd frontend && npm install`
2. **Configurar .env** - URL da VPS em `frontend/.env`
3. **Testar** - `npm run electron:dev`
4. **Gerar executável** - `npm run electron:build`
5. **Distribuir** - Compartilhar o instalador .exe

### Melhorias Futuras:
- Gerenciamento de categorias (modal criar/editar/deletar)
- Testes automatizados (Unit + E2E)
- Otimizações de performance

## 📅 Histórico de Mudanças
- **21/02/2026**: Planejamento completo - stack, schema, rotas, roadmap definidos
- **21/02/2026**: Fase 1 implementada - estrutura, interfaces básicas, mocks da API
- **21/02/2026**: Conexão real - banco PostgreSQL, autenticação JWT, API funcional, frontend conectado
- **21/02/2026**: NotesPage completa - salvamento automático, CRUD real
- **21/02/2026**: Design System Violet - redesign completo com @design-engineer skill
- **21/02/2026**: Fase 3 COMPLETA ✅ - UI/UX refinada, atalhos, tema claro/escuro, exportação de notas
- **21/02/2026**: Electron configurado - App desktop pronto para build, conecta à VPS
- **21/02/2026**: Deploy configurado - Dockerfile otimizado, .dockerignore, guia completo de deploy
