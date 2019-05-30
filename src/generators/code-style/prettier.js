import Generator from 'yeoman-generator';
import { addDevDependencies, updatePackageJson } from '../../util/updatePkg';
import { stable } from '../../util/deps';

export default class Prettier extends Generator {
  async writing() {
    await addDevDependencies.call(this, stable.pick('prettier'));
    await updatePackageJson.call(this, (pkg) => ({
      ...pkg,
      prettier: {
        arrowParens: 'always',
        semi: true,
        singleQuote: true,
        trailingComma: 'es5',
      },
    }));
  }

  async installing() {
    await this.npmInstall();
  }
}
Prettier.key = 'code-style:prettier';
