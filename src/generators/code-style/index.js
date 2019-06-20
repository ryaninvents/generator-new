import Generator from 'yeoman-generator';
import chalk from 'chalk';

import Eslint from './eslint';
import Prettier from './prettier';
import EslintPrettier from './eslint-prettier';
import Xo from './xo';
import ReactApp from './react-app';
import PrettierHook from './prettier-hook';

const RULESET_CHOICES = [
  {
    name: 'Create React App',
    short: 'create-react-app',
    value: 'react-app',
  },
  {
    name: 'XO',
    short: 'XO',
    value: 'xo',
  },
  {
    name: '"Prettier" rules only',
    short: 'Prettier',
    value: 'prettier',
  },
];

export default class CodeStyle extends Generator {
  constructor(...args) {
    super(...args);
    this.option('interactive', {
      type: Boolean,
      required: false,
      default: false,
      description: 'If true, prompt for input',
    });
    this.option('ruleset', {
      type: String,
      description:
        'Which configuration to apply (xo, react-app, prettier; default xo)',
      default: 'xo',
    });
  }

  async configuring() {
    if (this.options.interactive) {
      this.log(chalk.bold.underline('\nCode style options'));
      const { ruleset } = await this.prompt([
        {
          name: 'ruleset',
          message: 'Which ruleset should be used?',
          choices: RULESET_CHOICES,
          type: 'list',
        },
      ]);
      this.options.ruleset = ruleset;
    }

    this.composeWith({
      Generator: EslintPrettier,
      path: `${__dirname}/index.js`,
    });

    switch (this.options.ruleset) {
      case 'xo':
        this.composeWith({
          Generator: Xo,
          path: `${__dirname}/index.js`,
        });
        break;
      case 'react-app':
        this.composeWith({
          Generator: ReactApp,
          path: `${__dirname}/index.js`,
        });
        break;
      case 'prettier':
        this.composeWith({
          Generator: PrettierHook,
          path: `${__dirname}/index.js`,
        });
        break;
      default:
        break;
    }
  }
}
CodeStyle.key = 'code-style';

export const allCodeStyle = [
  CodeStyle,
  Eslint,
  Prettier,
  EslintPrettier,
  ReactApp,
  Xo,
  PrettierHook,
];

Object.assign(CodeStyle, {
  Eslint,
  Prettier,
  EslintPrettier,
  ReactApp,
  Xo,
  PrettierHook,
});
