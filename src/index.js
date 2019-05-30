import yoxable from 'yoxable';
import Project from './generators/project';
import SortPkg from './generators/sort-pkg';
import Hooks from './generators/hooks';
import Pack, { allPack } from './generators/pack';
import TypeScript, { allTs } from './generators/ts';
import Release, { allRelease } from './generators/release';
import CodeStyle, { allCodeStyle } from './generators/code-style';
import checkForUpdates from './update-check';

export { Project, SortPkg, Pack, TypeScript, Release, CodeStyle };

const runGenerators = yoxable({
  pkg: require('../package.json'),
  generators: [
    Project,
    SortPkg,
    Hooks,
    ...allPack,
    ...allTs,
    ...allRelease,
    ...allCodeStyle,
  ],
});

export default (...args) => {
  checkForUpdates();
  return runGenerators(...args);
};
