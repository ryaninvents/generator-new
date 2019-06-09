import Generator from 'yeoman-generator';
import { addDevDependencies, configureBabelPreset } from '../../util/updatePkg';
import { stable } from '../../util/deps';

export default class BabelNode extends Generator {
  async writing() {
    await addDevDependencies.call(this, stable.pick('@babel/preset-env'));
    await configureBabelPreset.call(this, [
      '@babel/preset-env',
      { targets: { node: 8 }, modules: false },
    ]);
  }

  async installing() {
    await this.npmInstall();
  }
}
BabelNode.key = 'babel:node';
