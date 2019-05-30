import Generator from 'yeoman-generator';
import {
  addDevDependencies,
  addHuskyHook,
  updatePackageJson,
} from '../../util/updatePkg';
import { stable } from '../../util/deps';
import Hooks from '../hooks';

export default class Eslint extends Generator {
  initializing() {
    this.composeWith({ Generator: Hooks, path: `${__dirname}/index.js` });
  }

  async writing() {
    await addDevDependencies.call(
      this,
      stable.pick('eslint', 'lint-staged', 'sort-package-json')
    );
    await addHuskyHook.call(this, { 'pre-commit': 'lint-staged' });
    await updatePackageJson.call(this, (pkg) => ({
      ...pkg,
      'lint-staged': {
        ...(pkg['lint-staged'] || null),
        'package.json': ['sort-package-json', 'git add'],
        'src/**/*.{js,jsx,ts,tsx}': ['eslint --fix', 'git add'],
      },
    }));
  }

  async installing() {
    await this.npmInstall();
  }
}
Eslint.key = 'code-style:eslint';
