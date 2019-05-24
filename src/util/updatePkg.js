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
