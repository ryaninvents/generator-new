import Generator from 'yeoman-generator';
import { updatePackageJson } from '../../util/updatePkg';

export default class ReleaseSimpleConfig extends Generator {
  async writing() {
    await updatePackageJson.call(this, (pkg) => ({
      ...pkg,
      release: {
        plugins: [
          '@semantic-release/npm',
          {
            pkgRoot: './pkg',
          },
        ],
      },
    }));
  }
}
ReleaseSimpleConfig.key = 'release:simple-config';
