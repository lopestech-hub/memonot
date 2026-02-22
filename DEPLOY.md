# 🚀 Deploy do MemoNot na VPS com EasyPanel

## 📋 Pré-requisitos

- VPS com EasyPanel instalado
- Banco PostgreSQL criado no EasyPanel
- Repositório Git (GitHub, GitLab, etc.)

---

## 🗄️ Passo 1: Configurar Banco de Dados

### No EasyPanel:

1. Acesse **Databases** → **Create Database**
2. Escolha **PostgreSQL**
3. Configure:
   - **Name:** `db-memonot`
   - **User:** `postgres`
   - **Password:** (gere uma senha segura)
   - **Port:** (anote a porta, ex: 4121)

4. Após criar, copie a **Connection String**:
```
postgres://postgres:SENHA@easypanel.lopestechhub.com.br:4121/db-memonot?sslmode=disable
```

---

## 📦 Passo 2: Preparar o Código

### 1. Criar `.env` na raiz do projeto:

```env
# Banco de Dados (copie do EasyPanel)
DATABASE_URL="postgres://postgres:SENHA@easypanel.lopestechhub.com.br:4121/db-memonot?sslmode=disable"

# Timezone
TZ=America/Sao_Paulo
PGTZ=America/Sao_Paulo

# Autenticação (MUDE EM PRODUÇÃO!)
JWT_SECRET=memonot-super-secret-key-MUDE-ISSO-EM-PRODUCAO
JWT_EXPIRES_IN=10h
JWT_REFRESH_EXPIRES_IN=7d

# App
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://seu-dominio.com.br
```

### 2. Commit e Push para o Git:

```bash
git add .
git commit -m "feat: configuração para deploy"
git push origin main
```

---

## 🐳 Passo 3: Deploy no EasyPanel

### 1. Criar Aplicação:

1. No EasyPanel, vá em **Apps** → **Create App**
2. Escolha **From Git Repository**
3. Configure:
   - **Name:** `memonot`
   - **Repository:** URL do seu repositório Git
   - **Branch:** `main`
   - **Build Method:** `Dockerfile`

### 2. Configurar Variáveis de Ambiente:

No painel da aplicação, vá em **Environment Variables** e adicione:

```
DATABASE_URL=postgres://postgres:SENHA@easypanel.lopestechhub.com.br:4121/db-memonot?sslmode=disable
TZ=America/Sao_Paulo
PGTZ=America/Sao_Paulo
JWT_SECRET=memonot-super-secret-key-MUDE-ISSO-EM-PRODUCAO
JWT_EXPIRES_IN=10h
JWT_REFRESH_EXPIRES_IN=7d
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://seu-dominio.com.br
```

### 3. Configurar Porta:

- **Port:** `3000`
- **Protocol:** `HTTP`

### 4. Configurar Domínio (opcional):

1. Vá em **Domains**
2. Adicione seu domínio ou use o subdomínio do EasyPanel
3. EasyPanel configura SSL automaticamente

### 5. Deploy:

1. Clique em **Deploy**
2. Aguarde o build (pode levar 5-10 minutos na primeira vez)
3. Acompanhe os logs em **Logs**

---

## 🔄 Passo 4: Rodar Migrações do Prisma

### Opção A: Via Terminal do EasyPanel

1. No painel da aplicação, vá em **Terminal**
2. Execute:
```bash
npx prisma migrate deploy
```

### Opção B: Via Script Local

Se tiver acesso SSH à VPS:
```bash
ssh usuario@sua-vps.com.br
cd /caminho/do/app
npx prisma migrate deploy
```

---

## ✅ Passo 5: Verificar Deploy

### 1. Testar API:

```bash
curl https://seu-dominio.com.br/health
# ou
curl https://memonot.easypanel.io/health
```

### 2. Acessar Frontend:

Abra no navegador:
```
https://seu-dominio.com.br
```

### 3. Criar Primeiro Usuário:

Use a rota de registro:
```
POST https://seu-dominio.com.br/auth/register
{
  "nome": "Admin",
  "email": "admin@memonot.com",
  "senha": "senha123"
}
```

---

## 🔧 Troubleshooting

### Build Falha:

1. Verifique os logs no EasyPanel
2. Certifique-se que `package.json` está correto
3. Verifique se todas as dependências estão instaladas

### Erro de Conexão com Banco:

1. Verifique se `DATABASE_URL` está correto
2. Teste a conexão do banco no EasyPanel
3. Certifique-se que a porta está correta

### App não inicia:

1. Verifique se `PORT=3000` está configurado
2. Veja os logs da aplicação
3. Certifique-se que o Dockerfile está correto

### CORS Error:

Verifique se `FRONTEND_URL` está configurado corretamente no `.env`

---

## 🔄 Atualizações Futuras

### Deploy Automático:

O EasyPanel faz deploy automático quando você faz push para o Git:

```bash
# Fazer alterações no código
git add .
git commit -m "feat: nova funcionalidade"
git push origin main

# EasyPanel detecta e faz deploy automaticamente
```

### Deploy Manual:

No painel do EasyPanel, clique em **Redeploy**

---

## 📊 Monitoramento

### Logs:

No EasyPanel, vá em **Logs** para ver:
- Logs da aplicação
- Erros
- Requisições

### Métricas:

No EasyPanel, vá em **Metrics** para ver:
- CPU usage
- Memory usage
- Network traffic

---

## 🔒 Segurança

### Checklist de Produção:

- [ ] Mudar `JWT_SECRET` para valor único e seguro
- [ ] Configurar HTTPS (EasyPanel faz automaticamente)
- [ ] Usar senha forte no PostgreSQL
- [ ] Não commitar `.env` no Git (usar `.env.example`)
- [ ] Configurar backup do banco de dados
- [ ] Limitar acesso ao banco (apenas app pode conectar)

---

## 📝 Estrutura do Deploy

```
EasyPanel
├── Database (PostgreSQL)
│   └── db-memonot
│
└── App (Docker)
    ├── Frontend (React buildado)
    ├── Backend (Fastify)
    └── Conecta ao Database
```

---

## 🆘 Suporte

Se tiver problemas:

1. Verifique os logs no EasyPanel
2. Teste localmente com Docker:
   ```bash
   docker build -t memonot .
   docker run -p 3000:3000 --env-file .env memonot
   ```
3. Consulte a documentação do EasyPanel

---

## ✅ Checklist Final

- [ ] Banco de dados criado no EasyPanel
- [ ] `.env` configurado com variáveis corretas
- [ ] Código commitado e pushed para Git
- [ ] Aplicação criada no EasyPanel
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy realizado com sucesso
- [ ] Migrações do Prisma executadas
- [ ] API respondendo (teste com curl)
- [ ] Frontend acessível no navegador
- [ ] Primeiro usuário criado e testado
