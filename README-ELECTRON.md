# MemoNot - Aplicativo Desktop

## 🚀 Como Funciona

O MemoNot Desktop é um aplicativo Electron que empacota o frontend React em uma janela nativa do Windows.

**Arquitetura:**
- **Frontend:** React empacotado no Electron (roda localmente)
- **Backend:** Fastify na VPS (servidor remoto)
- **Banco de Dados:** PostgreSQL na VPS (servidor remoto)

O aplicativo desktop se conecta via HTTP à API na VPS, mantendo todos os dados centralizados e sincronizados.

## 📦 Instalação das Dependências

```bash
cd frontend
npm install
```

Isso instalará:
- `electron` - Framework para criar apps desktop
- `electron-builder` - Para gerar executáveis
- `concurrently` - Rodar múltiplos comandos
- `wait-on` - Esperar servidor estar pronto

## 🛠️ Desenvolvimento

### 1. Configurar URL da API

Crie o arquivo `.env` na pasta `frontend/`:

```env
VITE_API_URL=https://sua-vps.com.br/api
```

Substitua `sua-vps.com.br` pelo endereço real da sua VPS.

### 2. Rodar em modo desenvolvimento

```bash
cd frontend
npm run electron:dev
```

Isso irá:
1. Iniciar o Vite dev server (React)
2. Aguardar o servidor estar pronto
3. Abrir o Electron apontando para localhost:5173

## 📦 Build do Executável

### 1. Build do Frontend

```bash
cd frontend
npm run build
```

Isso gera a pasta `dist/` com o React buildado.

### 2. Gerar Executável Windows

```bash
npm run electron:build
```

Isso irá:
1. Buildar o frontend (se ainda não buildou)
2. Empacotar tudo com electron-builder
3. Gerar o instalador em `frontend/release/`

**Arquivos gerados:**
- `MemoNot Setup 1.0.0.exe` - Instalador NSIS
- `MemoNot 1.0.0.exe` - Executável portátil

## 🎨 Personalização

### Ícone do Aplicativo

Coloque um arquivo `icon.png` (256x256px ou maior) em `frontend/electron/`:

```
frontend/
└── electron/
    ├── main.js
    └── icon.png  ← Seu ícone aqui
```

### Configurações do Build

Edite `package.json` na seção `build`:

```json
"build": {
  "appId": "com.memonot.app",
  "productName": "MemoNot",
  "win": {
    "target": ["nsis"],
    "icon": "electron/icon.png"
  }
}
```

## 🌐 Conexão com a VPS

O aplicativo desktop faz requisições HTTP para a API na VPS usando a URL configurada em `.env`:

```
MemoNot.exe → HTTP → VPS (Backend + Banco)
```

**Requisitos:**
- VPS deve estar acessível pela internet
- Backend deve aceitar requisições CORS do Electron
- HTTPS recomendado para produção

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Vite dev server
npm run electron:dev     # Electron + Vite dev

# Build
npm run build           # Build do React
npm run electron:build  # Build do executável

# Outros
npm run preview         # Preview do build
npm run lint           # Verificar código
```

## ✅ Checklist de Deploy

- [ ] Configurar `.env` com URL da VPS
- [ ] Testar conexão com a API
- [ ] Adicionar ícone personalizado
- [ ] Buildar frontend (`npm run build`)
- [ ] Gerar executável (`npm run electron:build`)
- [ ] Testar instalador no Windows
- [ ] Distribuir o instalador

## 🔧 Troubleshooting

### Erro de conexão com a API

Verifique:
1. URL da API no `.env` está correta
2. VPS está acessível
3. Backend aceita CORS

### Electron não abre

```bash
# Limpar cache e reinstalar
rm -rf node_modules
npm install
npm run electron:dev
```

### Build falha

Verifique:
1. `npm run build` funciona
2. Pasta `dist/` foi criada
3. Todas as dependências estão instaladas

## 📚 Recursos

- [Electron Docs](https://www.electronjs.org/docs)
- [electron-builder](https://www.electron.build/)
- [Vite](https://vitejs.dev/)
