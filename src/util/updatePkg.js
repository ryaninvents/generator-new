import sortPkg from 'sort-package-json';

export async function readPackageJson(path = 'package.json') {
  return this.fs.readJSON(this.destinationPath(path));
}

export async function updatePackageJson(
  updater = (pkg) => pkg,
  path = 'package.json'
) {
  const sourcePackageJson = await readPackageJson.call(this, path);
  const result = updater(sourcePackageJson);
  await this.fs.writeJSON(this.destinationPath(path), sortPkg(result));
}

function createKeyUpdater(key) {
  return async function(opts) {
    return updatePackageJson.call(this, (pkg) => ({
      ...pkg,
      [key]: {
        ...(pkg[key] || {}),
        ...opts,
      },
    }));
  };
}

export const addDependencies = createKeyUpdater('dependencies');
export const addDevDependencies = createKeyUpdater('devDependencies');
export const addScripts = createKeyUpdater('scripts');

export async function addHuskyHook(spec, ...rest) {
  return updatePackageJson.call(
    this,
    (pkg) => ({
      ...pkg,
      husky: {
        ...(pkg.husky || null),
        hooks: {
          ...(pkg.husky ? pkg.husky.hooks : null),
          ...spec,
        },
      },
    }),
    ...rest
  );
}

export async function updateBabelConfig(transformer, ...rest) {
  return updatePackageJson.call(
    this,
    ({ babel = {}, ...pkg }) => ({
      ...pkg,
      babel: transformer(babel),
    }),
    ...rest
  );
}

export function createBabelArrayItemUpdater(key) {
  return async function updateBabelValue(spec, ...rest) {
    let writtenSpec = spec;
    if (typeof spec === 'string') writtenSpec = [spec];
    return updateBabelConfig.call(
      this,
      ({ [key]: list, ...restBabelConfig }) => {
        const matchingItemIndex = list.findIndex(
          (element) =>
            element === writtenSpec[0] || element[0] === writtenSpec[0]
        );
        if (matchingItemIndex === -1) {
          return {
            ...restBabelConfig,
            [key]: [...list, writtenSpec],
          };
        }

        return {
          ...restBabelConfig,
          [key]: [
            ...list.slice(0, matchingItemIndex),
            writtenSpec,
            ...list.slice(matchingItemIndex + 1),
          ],
        };
      },
      ...rest
    );
  };
}

export const configureBabelPreset = createBabelArrayItemUpdater('presets');
export const configureBabelPlugin = createBabelArrayItemUpdater('plugins');

const PIKA_PACK_KEY = '@pika/pack';

export async function updatePikaPipeline(updater, path = 'package.json') {
  return updatePackageJson.call(
    this,
    (prevPkg) => {
      const pkg = prevPkg;
      if (!pkg[PIKA_PACK_KEY]) pkg[PIKA_PACK_KEY] = {};
      const pikaCfg = pkg[PIKA_PACK_KEY];
      if (!pikaCfg.pipeline) pikaCfg.pipeline = [];
      pikaCfg.pipeline = updater(pikaCfg.pipeline);
      return pkg;
    },
    path
  );
}

export function builderNameMatchesPredicate(p) {
  return (s) => p(s && s[0] ? s[0] : s);
}

export function builderNameMatches(name) {
  return builderNameMatchesPredicate((s) => s === name);
}

export function builderNameEndsWith(str) {
  return builderNameMatchesPredicate((s) => s.endsWith(str));
}
