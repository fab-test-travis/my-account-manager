import path from 'path'
import os from 'os'
import fs from 'fs'
import * as jsonfile from 'jsonfile'

/**
 * Config properties:
 * - storageFolder
 */
export default class Config {
  constructor() {
    this.load()
  }

  load() {
    let devSuffix = process.env.NODE_ENV === 'production' ? '' : '-DEV'
    this.configFolderPath = path.join(os.homedir(), '.my-account-manager')
    this.configFilePath = path.join(this.configFolderPath, `config${devSuffix}.json`)
    if (fs.existsSync(this.configFilePath)) {
      this.props = jsonfile.readFileSync(this.configFilePath, 'UTF-8')
    } else {
      this.createEmptyConfig()
      this.save()
    }
    alert('')
  }

  save() {
    if (!fs.existsSync(this.configFolderPath)) {
      fs.mkdirSync(this.configFolderPath)
    }
    fs.writeFileSync(this.configFilePath, JSON.stringify(this.props), 'UTF-8')
  }

  createEmptyConfig() {
    this.props = {
      storageFolder: ''
    }
  }
}
