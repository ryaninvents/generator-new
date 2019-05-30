import Generator from 'yeoman-generator';
import { addDevDependencies, addHuskyHook } from '../util/updatePkg';
import { stable } from '../util/deps';

export default class Hooks extends Generator {
  async writing() {
    await addDevDependencies.call(this, stable.pick('husky'));
    await addHuskyHook.call(this, {});
  }

  async installing() {
    await this.npmInstall();
  }
}
Hooks.key = 'hooks';
