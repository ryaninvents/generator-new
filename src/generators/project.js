import Generator from 'yeoman-generator';
import chalk from 'chalk';
import { resolve } from 'path';
import { updatePackageJson } from '../util/updatePkg';
import Readme from './readme';
import CodeStyle from './code-style';
import Babel from './babel';

const PROJECT_TYPES = [
  {
    name: 'React component',
    value: 'react-component',
  },
  {
    name: 'CLI tool',
    value: 'cli',
  },
  {
    name: 'Node.js package',
    value: 'pkg',
  },
];

export default class Project extends Generator {
  constructor(...args) {
    super(...args);
    this.argument('projectName', {
      type: String,
      required: false,
    });
    this.option('description', {
      type: String,
      required: false,
    });
    this.option('here', {
      type: 'Boolean',
      required: false,
      description:
        'Always create in this directory (do not look for .yo-rc.json)',
    });
    this.option('interactive', {
      type: Boolean,
      required: false,
      default: true,
      description: 'If false, do not prompt for extra input',
    });
    this.option('projectType', {
      type: String,
      required: false,
      description: 'Project type (cli, pkg, react-component)',
    });
  }

  async prompting() {
    this.log(chalk.bold.underline('\nProject options'));
    const { projectName, description } = await this.prompt([
      {
        name: 'projectName',
        when: !this.options.projectName,
        message: 'Package name?',
      },
      {
        name: 'description',
        when: !this.options.description,
        message: 'Package description?',
      },
    ]);

    if (!this.options.projectName) {
      this.options.projectName = projectName;
    }

    if (!this.options.description) {
      this.options.description = description;
    }

    if (this.options.interactive !== false && !this.options.projectType) {
      const { projectType } = await this.prompt([
        {
          name: 'projectType',
          message: 'What type of project?',
          type: 'list',
          choices: PROJECT_TYPES,
        },
      ]);
      this.options.projectType = projectType;
    }
  }

  configuring() {
    this.composeWith({ Generator: Readme, path: `${__dirname}/index.js` });
    const { interactive } = this.options;
    let lintingOpts = { interactive };
    let babelOpts = null;

    switch (this.options.projectType) {
      case 'react-component':
        lintingOpts = { ruleset: 'react-app' };
        babelOpts = { config: 'react' };
        break;
      case 'cli':
      case 'pkg':
        lintingOpts = { ruleset: 'xo' };
        babelOpts = { config: 'node' };
        break;
      default:
        break;
    }

    this.composeWith(
      { Generator: CodeStyle, path: `${__dirname}/index.js` },
      lintingOpts
    );
    if (babelOpts) {
      this.composeWith(
        { Generator: Babel, path: `${__dirname}/index.js` },
        babelOpts
      );
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
      description: this.options.description,
    }));
  }

  end() {
    this.log('success');
  }
}
