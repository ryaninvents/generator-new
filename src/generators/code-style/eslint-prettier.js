import Generator from 'yeoman-generator';
import { addDevDependencies, updatePackageJson } from '../../util/updatePkg';
import { stable } from '../../util/deps';
import Prettier from './prettier';
import Eslint from './eslint';

function extendEslint(config, newConfig) {
  if (!config) return [newConfig];
  if (Array.isArray(config))
    return [...config.filter((c) => c !== newConfig), newConfig];
  if (config === newConfig) return [newConfig];
  return [config, newConfig];
}

export default class EslintPrettier extends Generator {
  initializing() {
    this.composeWith({ Generator: Prettier, path: `${__dirname}/index.js` });
    this.composeWith({ Generator: Eslint, path: `${__dirname}/index.js` });
  }

  async writing() {
    await addDevDependencies.call(
      this,
      stable.pick('eslint-config-prettier', 'eslint-plugin-prettier')
    );
    await updatePackageJson.call(
      this,
      ({ eslintConfig: eslint = {}, ...pkg }) => ({
        ...pkg,
        eslintConfig: {
          ...(eslint || null),
          extends: extendEslint(eslint.extends, 'prettier', Infinity),
          plugins: extendEslint(eslint.plugins, 'prettier'),
          rules: {
            ...(eslint.rules || null),
            'prettier/prettier': 'error',
            'func-names': 'off',
          },
        },
      })
    );
  }

  async installing() {
    await this.npmInstall();
  }
}
EslintPrettier.key = 'code-style:eslint-prettier';
