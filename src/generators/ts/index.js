import Generator from 'yeoman-generator';
import TsConfig from './tsconfig';
import TsDeps from './deps';

export default class Ts extends Generator {
  async end() {
    this.composeWith({ Generator: TsConfig, path: `${__dirname}/index.js` });
    this.composeWith({ Generator: TsDeps, path: `${__dirname}/index.js` });
  }
}

export const allTs = [Ts, TsConfig, TsDeps];
