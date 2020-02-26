'use strict'

import { app, protocol, ipcMain, BrowserWindow } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import { Settings } from './settings.js'

const isDevelopment = process.env.NODE_ENV !== 'production'

const settings = new Settings({
  defaults: {
    windowSize: { width: 1700, height: 800 },
    targetPath: ''
  }
})

let win

protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])

function createWindow() {
  win = new BrowserWindow({
    width: settings.get('windowSize').width,
    height: settings.get('windowSize').height,
    webPreferences: {
      nodeIntegration: true
    }
  })

  if (settings.get('windowMaximized')) {
    win.maximize()
  }

  win.on('resize', () => {
    let { width, height } = win.getBounds()
    settings.set('windowSize', { width, height })
  })
  win.on('maximize', () => {
    let { width, height } = win.getBounds()
    settings.set('windowSize', { width, height })
    settings.set('windowMaximized', true)
  })
  win.on('unmaximize', () => {
    let { width, height } = win.getBounds()
    settings.set('windowSize', { width, height })
    settings.set('windowMaximized', false)
  })
  win.on('restore', () => {
    let { width, height } = win.getBounds()
    settings.set('windowSize', { width, height })
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })

  ipcMain.on('set_targetPath', (event, targetPath) => {
    settings.set('targetPath', targetPath)
  })
  ipcMain.on('get_targetPath', (event) => {
    event.returnValue = settings.get('targetPath')
  })
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

app.on('ready', async () => {
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
