import Generator from 'yeoman-generator';
import chalk from 'chalk';
import { resolve } from 'path';
import { updatePackageJson } from '../util/updatePkg';
import Readme from './readme';
import CodeStyle from './code-style';
import Babel from './babel';
import Release from './release';
import Ts from './ts';
import Pack from './pack';

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
    this.option('language', {
      type: String,
      required: false,
      description: 'Language (js, ts)',
    });
  }

  async prompting() {
    this.log(chalk.bold.underline('\nProject options'));
    const {
      projectName,
      description,
      projectType,
      language,
    } = await this.prompt([
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
      {
        name: 'projectType',
        message: 'What type of project?',
        type: 'list',
        choices: PROJECT_TYPES,
        when: this.options.interactive !== false && !this.options.projectType,
      },
      {
        name: 'language',
        message: 'Language?',
        type: 'list',
        when: this.options.interactive !== false && !this.options.language,
        choices: [
          { name: 'JavaScript', value: 'js' },
          { name: 'TypeScript', value: 'ts' },
        ],
      },
    ]);

    if (!this.options.projectName) {
      this.options.projectName = projectName;
    }

    if (!this.options.description) {
      this.options.description = description;
    }

    if (!this.options.projectType) {
      this.options.projectType = projectType;
    }

    if (!this.options.language) {
      this.options.language = language;
    }
  }

  configuring() {
    this.composeWith({ Generator: Readme, path: `${__dirname}/index.js` });
    this.composeWith(
      { Generator: Release, path: `${__dirname}/index.js` },
      { channel: 'beta' }
    );

    const { interactive } = this.options;
    let lintingOpts = { interactive };
    let babelOpts = null;

    switch (this.options.language) {
      case 'js':
        switch (this.options.projectType) {
          case 'react-component':
            lintingOpts = { ruleset: 'react-app' };
            babelOpts = { config: 'react' };
            this.composeWith(
              { Generator: Pack, path: `${__dirname}/index.js` },
              { type: 'js' }
            );
            break;
          case 'cli':
            this.composeWith(
              { Generator: Pack, path: `${__dirname}/index.js` },
              { type: 'exe' }
            );
            lintingOpts = { ruleset: 'xo' };
            babelOpts = { config: 'node' };
            break;
          case 'pkg':
            this.composeWith(
              { Generator: Pack, path: `${__dirname}/index.js` },
              { type: 'js' }
            );
            lintingOpts = { ruleset: 'xo' };
            babelOpts = { config: 'node' };
            break;
          default:
            break;
        }

        break;

      case 'ts':
        this.composeWith({ Generator: Ts, path: `${__dirname}/index.js` });
        this.composeWith(
          { Generator: Pack, path: `${__dirname}/index.js` },
          { type: 'js' }
        );
        lintingOpts = { ruleset: 'prettier' };
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
