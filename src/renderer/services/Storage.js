import * as jsonfile from 'jsonfile'

const repoFile =
  '/Users/bellingard/Repos/_PERSO_/_resources_/some-tests/Comptes.json'
const payeeFinderConfFile =
  '/Users/bellingard/Repos/_PERSO_/_resources_/some-tests/PayeeFinder.json'

export default class Storage {
  constructor() {
    // Let's hard code the path during the first development stages
    this.repo = jsonfile.readFileSync(repoFile, 'UTF-8')
    this.payeeFinderConf = jsonfile.readFileSync(payeeFinderConfFile, 'UTF-8')
  }

  repo() {
    return this.repo
  }

  payeeFinders() {
    return this.payeeFinderConf
  }

  reload(cb) {
    this.loadRepo(cb)
  }

  loadRepo(cb) {
    jsonfile.readFile(repoFile, 'UTF-8', (err, obj) => {
      if (!err) {
        this.repo = obj
        this.loadPayeeConf(cb)
      } else {
        cb(err)
      }
    })
  }

  loadPayeeConf(cb) {
    jsonfile.readFile(payeeFinderConfFile, 'UTF-8', (err, obj) => {
      if (!err) {
        this.payeeFinderConf = obj
        cb()
      } else {
        cb(err)
      }
    })
  }
}
