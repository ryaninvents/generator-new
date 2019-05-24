import Generator from 'yeoman-generator';
import { stable } from '../../util/deps';
import { addDevDependencies } from '../../util/updatePkg';

export default class TsDeps extends Generator {
  async writing() {
    await addDevDependencies.call(this, stable.pick('typescript'));
  }

  async installing() {
    await this.npmInstall();
  }
}
TsDeps.key = 'ts.deps';
