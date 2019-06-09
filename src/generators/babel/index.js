import Generator from 'yeoman-generator';
import chalk from 'chalk';
import { stable } from '../../util/deps';

import BabelNode from './node';
import BabelReact from './react';
import { addDevDependencies } from '../../util/updatePkg';

const CONFIG_CHOICES = [
  {
    name: 'React component',
    value: 'react',
  },
  {
    name: 'Node.js',
    value: 'node',
  },
];

export default class Babel extends Generator {
  constructor(...args) {
    super(...args);
    this.option('interactive', {
      type: Boolean,
      required: false,
      default: false,
      description: 'If true, prompt for input',
    });
    this.option('config', {
      type: String,
      description: 'Which configuration to apply (react, node; default node)',
      default: 'node',
    });
  }

  async configuring() {
    if (this.options.interactive) {
      this.log(chalk.bold.underline('\nBabel options'));
      const { ruleset } = await this.prompt([
        {
          name: 'config',
          message: 'Which config should be used?',
          choices: CONFIG_CHOICES,
          type: 'list',
        },
      ]);
      this.options.ruleset = ruleset;
    }

    switch (this.options.ruleset) {
      case 'node':
        this.composeWith({
          Generator: BabelNode,
          path: `${__dirname}/index.js`,
        });
        break;
      case 'react':
        this.composeWith({
          Generator: BabelReact,
          path: `${__dirname}/index.js`,
        });
        break;
      default:
        break;
    }
  }

  async writing() {
    await addDevDependencies.call(this, stable.pick('@babel/node'));
  }

  async installing() {
    await this.npmInstall();
  }
}

export const allBabel = [Babel, BabelNode, BabelReact];

Object.assign(Babel, { Node: BabelNode, React: BabelReact });
