import Generator from 'yeoman-generator';
import { addDevDependencies, updatePackageJson } from '../../util/updatePkg';
import { stable } from '../../util/deps';
import { extendEslint } from '../../util/eslint';
import Prettier from './prettier';
import Eslint from './eslint';
import { xo as xoConfig } from './eslint-config';

export default class Xo extends Generator {
  initializing() {
    this.composeWith({ Generator: Prettier, path: `${__dirname}/index.js` });
    this.composeWith({ Generator: Eslint, path: `${__dirname}/index.js` });
  }

  async writing() {
    await addDevDependencies.call(this, stable.pick('eslint-config-xo'));
    await updatePackageJson.call(
      this,
      ({ eslintConfig: eslint = {}, ...pkg }) => ({
        ...pkg,
        eslintConfig: {
          ...(eslint || null),
          extends: extendEslint(eslint.extends, 'xo'),
          rules: {
            ...xoConfig.rules,
            ...((eslint || {}).rules || null),
          },
        },
      })
    );
  }

  async installing() {
    await this.npmInstall();
  }
}
Xo.key = 'code-style:xo';
