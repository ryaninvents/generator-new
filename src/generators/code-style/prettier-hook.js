import Generator from 'yeoman-generator';
import { addHuskyHook, updatePackageJson } from '../../util/updatePkg';
import Hooks from '../hooks';

export default class PrettierHook extends Generator {
  initializing() {
    this.composeWith({ Generator: Hooks, path: `${__dirname}/index.js` });
  }

  async writing() {
    await addHuskyHook.call(this, { 'pre-commit': 'lint-staged' });
    await updatePackageJson.call(this, (pkg) => ({
      ...pkg,
      'lint-staged': {
        ...(pkg['lint-staged'] || null),
        'package.json': ['sort-package-json', 'git add'],
        'src/**/*.{js,jsx,ts,tsx}': ['prettier --fix', 'git add'],
      },
    }));
  }
}
PrettierHook.key = 'code-style:prettier-hook';
