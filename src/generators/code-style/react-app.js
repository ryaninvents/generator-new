import Generator from 'yeoman-generator';
import { addDevDependencies, updatePackageJson } from '../../util/updatePkg';
import { stable } from '../../util/deps';
import { extendEslint } from '../../util/eslint';
import Prettier from './prettier';
import Eslint from './eslint';

export default class ReactApp extends Generator {
  initializing() {
    this.composeWith({ Generator: Prettier, path: `${__dirname}/index.js` });
    this.composeWith({ Generator: Eslint, path: `${__dirname}/index.js` });
  }

  async writing() {
    await addDevDependencies.call(
      this,
      stable.pick(
        'eslint-config-react-app',
        'babel-eslint',
        'eslint-plugin-flowtype',
        'eslint-plugin-import',
        'eslint-plugin-jsx-a11y',
        'eslint-plugin-react',
        'eslint-plugin-react-hooks'
      )
    );
    await updatePackageJson.call(
      this,
      ({ eslintConfig: eslint = {}, ...pkg }) => ({
        ...pkg,
        eslintConfig: {
          ...(eslint || null),
          extends: extendEslint(eslint.extends, 'react-app'),
        },
      })
    );
  }

  async installing() {
    await this.npmInstall();
  }
}
ReactApp.key = 'code-style:react-app';
