import yoxable from 'yoxable';
import Project from './generators/project';
import SortPkg from './generators/sort-pkg';
import Hooks from './generators/hooks';
import Pack, { allPack } from './generators/pack';
import TypeScript, { allTs } from './generators/ts';
import Release, { allRelease } from './generators/release';
import CodeStyle, { allCodeStyle } from './generators/code-style';
import Readme from './generators/readme';
import Babel, { allBabel } from './generators/babel';
import checkForUpdates from './update-check';

export {
  Project,
  SortPkg,
  Pack,
  TypeScript,
  Release,
  CodeStyle,
  Babel,
  Readme,
};

const runGenerators = yoxable({
  pkg: require('../package.json'),
  generators: [
    Project,
    SortPkg,
    Hooks,
    Readme,
    ...allPack,
    ...allTs,
    ...allRelease,
    ...allCodeStyle,
    ...allBabel,
  ],
});

export default (...args) => {
  checkForUpdates();
  return runGenerators(...args);
};
