import * as jsonfile from 'jsonfile'

export default class Storage {
  loadFromJsonSync(filePath) {
    this.repo = jsonfile.readFileSync(filePath, 'UTF-8')
  }

  loadFromJson(filePath, cb) {
    // const file: string = "resources/repository-big.json"
    // // A000001 / NomDuCompte => 6400.9
    // // A000003 / LivretA => 9882.66
    // console.log(repositoryService.getAccountBalance("A000001") / 100);
    // console.log(repositoryService.getAccountBalance("A000003") / 100);

    // this.repo = jsonfile.readFileSync(filePath, 'UTF-8')
    jsonfile.readFile(
      '/Users/bellingard/Repos/_PERSO_/typescript-test/resources/comptes.json',
      'UTF-8',
      (err, obj) => {
        if (!err) {
          this.repo = obj
        }
        cb(err, obj)
      }
    )
  }
}
