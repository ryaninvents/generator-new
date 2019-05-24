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
  'npm-run-all': '^4.1.5',
  'cross-env': '^5.2.0',
  typescript: '^3.4.5',
};

export const stable = createVersions(STABLE_SRC);
export const next = createVersions({ ...STABLE_SRC });
