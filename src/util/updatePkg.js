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
