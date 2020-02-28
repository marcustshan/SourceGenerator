'use strict'

import { app, protocol, ipcMain, BrowserWindow } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import { Settings } from './settings.js'

const isDevelopment = process.env.NODE_ENV !== 'production'

const settings = new Settings({
  defaults: {
    windowSize: { width: 1700, height: 800 },
    generatorInfo: {
      targetPath: '',
      packageName: '',
      moduleName: '',
      controllerPackageName: 'controller',
      servicePackageName: 'service',
      modelPackageName: 'model',
      daoPackageName: 'dao'
    }
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

  ipcMain.on('set_generatorInfo', (event, generatorInfo) => {
    settings.set('generatorInfo', generatorInfo)
  })
  ipcMain.on('get_generatorInfo', (event) => {
    event.returnValue = settings.get('generatorInfo')
  })

  /*
  const fs = require('fs');
  const path = require('path')
  let templatePath = path.join(__statics, '/templates');
  fs.readFile(`${templatePath}/ControllerTemplate.tmp`, data => { templates.controllerTemplate = data; });
  fs.readFile(`${templatePath}/ServiceTemplate.tmp`, data => { templates.serviceTemplate = data; });
  fs.readFile(`${templatePath}/ServiceImplTemplate.tmp`, data => { templates.serviceImplTemplate = data; });
  fs.readFile(`${templatePath}/DaoTemplate.tmp`, data => { templates.daoTemplate = data; });
  fs.readFile(`${templatePath}/ModelTemplate.tmp`, data => { templates.modelTemplate = data; });
  fs.readFile(`${templatePath}/MapperTemplate.tmp`, data => { templates.mapperTemplate = data; });
  */

  ipcMain.on('get_Templates', (event) => {
    event.returnValue = templates;
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



const templates = {
  Controller: `package {{PackageName}}.{{LowerModuleName}}.controller;

import org.springframework.web.bind.annotation.RestController;
import {{PackageName}}.{{LowerModuleName}}.service.{{UpperModuleName}}Service;

@RestController
public class {{UpperModuleName}}Controller {

    private final String URI_PREFIX = "/{{LowerModuleName}}";

    public {{UpperModuleName}}Service {{LowerModuleName}}Service;

    public {{UpperModuleName}}Controller({{UpperModuleName}}Service {{LowerModuleName}}Service) {
        this.{{LowerModuleName}}Service = {{LowerModuleName}}Service;
    }
}`,
  Service: `package {{PackageName}}.{{LowerModuleName}}.service;

public interface {{UpperModuleName}}Service {
}`,
  ServiceImpl: `package {{PackageName}}.{{LowerModuleName}}.service;

import {{PackageName}}.{{LowerModuleName}}.{{DaoPackageName}}.{{UpperModuleName}}Dao;
import org.springframework.stereotype.Service;
  
@Service
public class {{UpperModuleName}}ServiceImpl implements {{UpperModuleName}}Service {

    private {{UpperModuleName}}Dao {{LowerModuleName}}Dao;

    public {{UpperModuleName}}ServiceImpl({{UpperModuleName}}Dao {{LowerModuleName}}Dao)
    {
        this.{{LowerModuleName}}Dao = {{LowerModuleName}}Dao;
    }
}`,
  Dao: `package {{PackageName}}.{{LowerModuleName}}.{{DaoPackageName}};

import org.springframework.stereotype.Repository;
  
@Repository
public interface {{UpperModuleName}}Dao {
}`,
  Model: `package {{PackageName}}.{{LowerModuleName}}.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.apache.ibatis.type.Alias;
  
@Alias("{{LowerModuleName}}")
@Data
@EqualsAndHashCode(callSuper = false)
public class {{UpperModuleName}} {
}`,
  Mapper: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="{{PackageName}}.{{LowerModuleName}}.{{DaoPackageName}}.{{UpperModuleName}}Dao">

</mapper>`
}