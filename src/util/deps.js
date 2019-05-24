import pick from 'lodash/pick';

function createVersions(spec) {
  return {
    pick(...pkgNames) {
      return pick(spec, ...pkgNames);
    },
  };
}

const PIKA_BUILDERS_VERSION = '^0.4.0';

const STABLE_SRC = {
  '@pika/pack': '^0.3.7',
  '@pika/plugin-build-node': PIKA_BUILDERS_VERSION,
  '@pika/plugin-build-types': PIKA_BUILDERS_VERSION,
  '@pika/plugin-build-web': PIKA_BUILDERS_VERSION,
  '@pika/plugin-bundle-node': PIKA_BUILDERS_VERSION,
  '@pika/plugin-bundle-types': PIKA_BUILDERS_VERSION,
  '@pika/plugin-copy-assets': PIKA_BUILDERS_VERSION,
  '@pika/plugin-standard-pkg': PIKA_BUILDERS_VERSION,
  '@pika/plugin-ts-standard-pkg': PIKA_BUILDERS_VERSION,
  '@pika/types': PIKA_BUILDERS_VERSION,
  '@semantic-release/git': '^7.0.8',
  '@semantic-release/npm': '^5.1.7',
  '@semantic-release/commit-analyzer': '^6.1.0',
  '@semantic-release/release-notes-generator': '^7.1.4',
  '@semantic-release/changelog': '^3.0.2',
  '@semantic-release/github': '^5.2.10',
  'npm-run-all': '^4.1.5',
  'cross-env': '^5.2.0',
  'semantic-release': '^15.13.12',
  typescript: '^3.4.5',
};

export const stable = createVersions(STABLE_SRC);
export const beta = createVersions({
  ...STABLE_SRC,
  'semantic-release': '^16.0.0-beta.19',
  '@semantic-release/git': '^7.1.0-beta.3',
  '@semantic-release/npm': '^5.2.0-beta.6',
  '@semantic-release/commit-analyzer': '^7.0.0-beta.2',
  '@semantic-release/github': '^5.4.0-beta.1',
});
