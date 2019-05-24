import Generator from 'yeoman-generator';

export default class TsConfig extends Generator {
  async writing() {
    await this.fs.writeJSON(this.destinationPath('tsconfig.json'), {
      compilerOptions: {
        target: 'es2018',
        module: 'esnext',
        moduleResolution: 'node',
        esModuleInterop: true,
        jsx: 'react',
      },
    });
  }
}
TsConfig.key = 'ts:config';
