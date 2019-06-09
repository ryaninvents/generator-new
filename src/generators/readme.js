import Generator from 'yeoman-generator';
import defaults from 'lodash/defaults';
import { TEMPLATE_DIR } from '../util/paths';

export default class Readme extends Generator {
  constructor(...args) {
    super(...args);
    this.sourceRoot(TEMPLATE_DIR);
  }

  async writing() {
    if (await this.fs.exists('README.md')) {
      this.log('README.md already exists');
      return;
    }

    const pkgJson = defaults(
      {},
      this.options.pkgJson ||
        (await this.fs.readJSON(this.destinationPath('package.json'))) ||
        {},
      {
        name: 'package.name',
        description: 'package.description',
      }
    );
    await this.fs.copyTpl(
      this.templatePath('readme/default.tpl.md'),
      this.destinationPath('README.md'),
      {
        package: pkgJson,
      }
    );
  }
}
