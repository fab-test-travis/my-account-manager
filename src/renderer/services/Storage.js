import path from 'path'
import * as jsonfile from 'jsonfile'

export default class Storage {
  constructor(config) {
    this.config = config
    try {
      this.init()
    } catch (e) {
      // could not open one of the storage files: will need to open from the UI
    }
  }

  /**
   * Read all the storage files to load data
   */
  init() {
    // Base storage folder
    let storageFolder = this.config.props.storageFolder
    this.repoFile = path.join(storageFolder, 'Comptes.json')
    this.payeeFinderConfFile = path.join(storageFolder, 'PayeeFinder.json')
    // Let's read the storage files
    this.repo = jsonfile.readFileSync(this.repoFile, 'UTF-8')
    this.payeeFinderConf = jsonfile.readFileSync(this.payeeFinderConfFile, 'UTF-8')
  }

  // repo() {
  //   return this.repo
  // }

  payeeFinders() {
    return this.payeeFinderConf
  }

  savePayeeFinders(cb) {
    jsonfile.writeFile(this.payeeFinderConfFile, this.payeeFinders(), 'UTF-8', cb)
  }

  reload(cb) {
    this.loadRepo(cb)
  }

  loadRepo(cb) {
    jsonfile.readFile(this.repoFile, 'UTF-8', (err, obj) => {
      if (!err) {
        this.repo = obj
        this.loadPayeeConf(cb)
      } else {
        cb(err)
      }
    })
  }

  loadPayeeConf(cb) {
    jsonfile.readFile(this.payeeFinderConfFile, 'UTF-8', (err, obj) => {
      if (!err) {
        this.payeeFinderConf = obj
        cb()
      } else {
        cb(err)
      }
    })
  }
}
