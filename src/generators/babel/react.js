import Generator from 'yeoman-generator';
import { addDevDependencies, configureBabelPreset } from '../../util/updatePkg';
import { stable } from '../../util/deps';

export default class BabelReact extends Generator {
  async writing() {
    await addDevDependencies.call(this, stable.pick('babel-preset-react-app'));
    await configureBabelPreset.call(this, [
      'babel-preset-react-app',
      {
        absoluteRuntime: false,
        helpers: false,
        useESModules: false,
      },
    ]);
  }

  async installing() {
    await this.npmInstall();
  }
}
BabelReact.key = 'babel:react';
