import path from 'path'
import * as jsonfile from 'jsonfile'

export default class Storage {
  constructor(config) {
    this.config = config
    try {
      this.init()
    } catch (e) {
      alert('')
      // could not open one of the storage files: will need to open from the UI
    }
  }

  /**
   * Read all the storage files to load data
   */
  init() {
    alert('')
    // Base storage folder
    let storageFolder = this.config.props.storageFolder
    this.repoFile = path.join(storageFolder, 'Comptes.json')
    this.payeeFinderConfFile = path.join(storageFolder, 'PayeeFinder.json')
    // Let's read the storage files
    this.repo = jsonfile.readFileSync(this.repoFile, 'UTF-8')
    this.payeeFinderConf = jsonfile.readFileSync(this.payeeFinderConfFile, 'UTF-8')
  }

  payeeFinders() {
    return this.payeeFinderConf
  }

  /**
   * Saves everything:
   *   - repo
   *   - payee finders
   * If there's an error, it is passed in an 'err' parameter of the callback
   * @param {*} cb the callback
   */
  save(cb) {
    this.saveRepo(err => {
      if (err) {
        cb(err)
      } else {
        this.savePayeeFinders(cb)
      }
    })
  }

  saveRepo(cb) {
    jsonfile.writeFile(this.repoFile, this.repo, 'UTF-8', cb)
  }

  savePayeeFinders(cb) {
    jsonfile.writeFile(this.payeeFinderConfFile, this.payeeFinders(), 'UTF-8', cb)
  }

  /**
   * Loads everything:
   *   - repo
   *   - payee finders
   * If there's an error, it is passed in an 'err' parameter of the callback
   * @param {*} cb the callback
   */
  reload(cb) {
    this.loadRepo(err => {
      if (err) {
        cb(err)
      } else {
        this.loadPayeeConf(cb)
      }
    })
  }

  loadRepo(cb) {
    jsonfile.readFile(this.repoFile, 'UTF-8', (err, obj) => {
      if (err) {
        cb(err)
      } else {
        this.repo = obj
        cb()
      }
    })
  }

  loadPayeeConf(cb) {
    jsonfile.readFile(this.payeeFinderConfFile, 'UTF-8', (err, obj) => {
      if (err) {
        cb(err)
      } else {
        this.payeeFinderConf = obj
        cb()
      }
    })
  }
}
