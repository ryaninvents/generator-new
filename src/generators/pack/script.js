import Generator from 'yeoman-generator';
import { addDevDependencies, addScripts } from '../../util/updatePkg';
import { stable } from '../../util/deps';

export default class PackScript extends Generator {
  async writing() {
    await addDevDependencies.call(this, stable.pick('npm-run-all'));
    await addScripts.call(this, {
      build: 'npm-run-all build:pkg',
      'build:pkg': 'pack build',
    });
  }

  async installing() {
    await this.npmInstall();
  }
}
PackScript.key = 'pack.script';
