const { app, BrowserWindow } = require('electron')
const path = require('path')

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      devTools: true
    },
    icon: path.join(__dirname, 'icon.png'),
    backgroundColor: '#f8fafc',
    show: false,
    autoHideMenuBar: true
  })

  // Carrega o frontend buildado
  const startUrl = app.isPackaged
    ? `file://${path.join(__dirname, '../dist/index.html')}`
    : 'http://localhost:5173'

  mainWindow.loadURL(startUrl)

  // Mostra a janela quando estiver pronta
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  // Abre DevTools em desenvolvimento
  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
