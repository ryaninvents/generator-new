import yoxable from 'yoxable';
import Project from './generators/project';
import SortPkg from './generators/sort-pkg';
import Pack, { allPack } from './generators/pack';
import TypeScript, { allTs } from './generators/ts';
import Release, { allRelease } from './generators/release';
import checkForUpdates from './update-check';

export { Project, SortPkg, Pack, TypeScript, Release };

const runGenerators = yoxable({
  pkg: require('../package.json'),
  generators: [Project, SortPkg, ...allPack, ...allTs, ...allRelease],
});

export default (...args) => {
  checkForUpdates();
  return runGenerators(...args);
};
