import Generator from 'yeoman-generator';

import Eslint from './eslint';
import Prettier from './prettier';
import EslintPrettier from './eslint-prettier';
import Xo from './xo';
import ReactApp from './react-app';

export default class CodeStyle extends Generator {
  async configuring() {
    this.composeWith({
      Generator: EslintPrettier,
      path: `${__dirname}/index.js`,
    });
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
];

Object.assign(CodeStyle, { Eslint, Prettier, EslintPrettier, ReactApp, Xo });
