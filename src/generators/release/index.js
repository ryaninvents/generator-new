import Generator from 'yeoman-generator';
import ReleaseDeps from './deps';

export default class Release extends Generator {
  async end() {
    this.composeWith(
      { Generator: ReleaseDeps, path: `${__dirname}/index.js` },
      this.options
    );
  }
}

Object.assign(Release, { Deps: ReleaseDeps });

export const allRelease = [Release, ReleaseDeps];
