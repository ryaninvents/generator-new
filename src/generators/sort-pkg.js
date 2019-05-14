import Generator from 'yeoman-generator';
import { updatePackageJson } from '../util/updatePkg';

export default class SortPkg extends Generator {
  async writing() {
    await updatePackageJson.call(this);
  }
}
SortPkg.key = 'sort-pkg';
