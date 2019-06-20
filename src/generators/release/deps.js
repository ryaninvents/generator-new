import Generator from 'yeoman-generator';
import { stable, beta } from '../../util/deps';
import { addDevDependencies } from '../../util/updatePkg';

export default class ReleaseDeps extends Generator {
  constructor(...args) {
    super(...args);
    this.option('channel', {
      type: String,
      required: false,
      description:
        'Which version of Semantic Release to install (stable, beta)',
      default: 'stable',
    });
  }

  async writing() {
    const channel = this.options.channel === 'beta' ? beta : stable;
    await addDevDependencies.call(
      this,
      channel.pick(
        'semantic-release',
        '@semantic-release/git',
        '@semantic-release/github',
        '@semantic-release/npm',
        '@semantic-release/commit-analyzer',
        '@semantic-release/changelog'
      )
    );
  }

  async installing() {
    await this.npmInstall();
  }
}
ReleaseDeps.key = 'release:deps';
