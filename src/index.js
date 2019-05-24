import yoxable from 'yoxable';
import Project from './generators/project';
import SortPkg from './generators/sort-pkg';
import Pack, { allPack } from './generators/pack';
import TypeScript, { allTs } from './generators/ts';
import Release, { allRelease } from './generators/release';

export { Project, SortPkg, Pack, TypeScript, Release };

export default yoxable({
  pkg: require('../package.json'),
  generators: [Project, SortPkg, ...allPack, ...allTs, ...allRelease],
});
