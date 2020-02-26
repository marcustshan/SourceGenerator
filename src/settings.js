const electron = require('electron')
const path = require('path')
const fs = require('fs')

export class Settings {
  constructor (opts) {
    const userDataPath = (electron.app || electron.remote.app).getPath('userData')
    this.path = path.join(userDataPath, opts.configName + '.json')

    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, '', 'utf8')
    }

    try {
      this.data = JSON.parse(fs.readFileSync(this.path, 'utf8'))
    } catch (error) {
      this.data = opts.defaults
    }
  }

  get (key) {
    return this.data[key]
  }

  set (key, val) {
    this.data[key] = val
    fs.writeFileSync(this.path, JSON.stringify(this.data), 'utf8')
  }
}
