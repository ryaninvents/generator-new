import Generator from 'yeoman-generator';

import PackStandard from './standard';
import PackScript from './script';
import PackNode from './node';
import PackAssets from './assets';

export default class Pack extends Generator {
  constructor(...args) {
    super(...args);
    this.option('type', {
      type: String,
      required: false,
      description: 'Package type (js, ts, exe)',
    });
  }

  async prompting() {
    const { packType = this.options.type } = await this.prompt([
      {
        type: 'expand',
        name: 'packType',
        message: 'Which type of @pika/pack config?',
        when: !this.options.type,
        choices: [
          {
            key: 'j',
            name: 'JavaScript package',
            value: 'js',
          },
          {
            key: 't',
            name: 'TypeScript package',
            value: 'ts',
          },
          {
            key: 'x',
            name: 'Executable Node.js package',
            value: 'exe',
          },
        ],
      },
    ]);
    this.options.type = packType;
  }

  async writing() {
    this.composeWith({ Generator: PackScript, path: `${__dirname}/index.js` });
    switch (this.options.type) {
      case 'js':
        this.composeWith({
          Generator: PackStandard,
          path: `${__dirname}/index.js`,
        });
        this.composeWith({
          Generator: PackNode,
          path: `${__dirname}/index.js`,
        });
        break;
      case 'ts':
        this.composeWith(
          { Generator: PackStandard, path: `${__dirname}/index.js` },
          { typescript: true }
        );
        this.composeWith({
          Generator: PackNode,
          path: `${__dirname}/index.js`,
        });
        break;
      case 'exe':
        this.composeWith({
          Generator: PackStandard,
          path: `${__dirname}/index.js`,
        });
        this.composeWith({
          Generator: PackNode,
          path: `${__dirname}/index.js`,
        });
        this.composeWith({
          Generator: PackAssets,
          path: `${__dirname}/index.js`,
        });
        break;
      default:
        break;
    }
  }
}

export const allPack = [Pack, PackStandard, PackScript, PackNode, PackAssets];

Object.assign(Pack, {
  Standard: PackStandard,
  Script: PackScript,
  Node: PackNode,
  Assets: PackAssets,
});
