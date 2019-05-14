import Generator from 'yeoman-generator';
import { resolve } from 'path';
import { updatePackageJson } from '../util/updatePkg';

export default class Project extends Generator {
  constructor(...args) {
    super(...args);
    this.argument('projectName', {
      type: String,
      required: false,
    });
    this.option('here', {
      type: 'Boolean',
      required: false,
      description:
        'Always create in this directory (do not look for .yo-rc.json)',
    });
  }

  async prompting() {
    const { projectName } = await this.prompt([
      {
        name: 'projectName',
        when: !this.options.projectName,
        message: 'Package name?',
      },
    ]);
    if (!this.options.projectName) {
      this.options.projectName = projectName;
    }
  }

  async writing() {
    if (!this.config.existed && !this.options.here) {
      const oldRoot = this.destinationPath();
      const folderNameParts = this.options.projectName.split('/');
      const folderName = folderNameParts
        .slice(folderNameParts.length - 1)
        .join('/')
        .replace(/[^A-Za-z0-9-_$.]+/g, '_');
      this.destinationRoot(resolve(oldRoot, folderName));
    }
    await updatePackageJson.call(this, (pkg) => ({
      version: '0.0.0-semantically-released',
      ...pkg,
      name: this.options.projectName,
    }));
  }

  end() {
    this.log('success');
  }
}
