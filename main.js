const { app, BrowserWindow, nativeTheme, Menu } = require('electron/main')
const path = require('node:path')

function createWindow () {
  nativeTheme.themeSource ='dark'
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
   
    }
  })
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  win.maximize()
  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
// PERSONALIZANDO O MENU
const template = [
  {
      label: 'Arquivo',
      submenu: [
          {
              label: 'Sair',
              // Atribuindo evento de click para fechar o app
              click: ()=> app.quit(),
              accelerator: 'Alt+F4'
          }
      ]
  },
  {
      label: 'Exibir',
      submenu: [
          {
              label: 'Recarregar',
              role: 'reload'
          },
          {
              label: 'Ferramenta do desenvolvedor',
              role: 'toggleDevTools',
          },
          {
              //separa submenus com uma linha
              type: 'separator'
          },
          {
              label: 'Aplicar zoom',
              role: 'zoomIn'
          },
          {
              label: 'Reduzir zoom',
              role: 'zoomOut'
          },
          {
              label: 'Restaurar zoom',
              role: 'resetZoom'
          }
      ]
  },
  {
      label: 'Ajuda',
      submenu: [
          {
              label: 'Documentação',
              click: ()=> shell.openExternal('https://www.electronjs.org/docs/latest/api/shell')
          },
          {
              type: 'separator'
          },
          {
              label: 'Sobre',
              click: ()=> paginaSobre()
          }
      ]
  }
]