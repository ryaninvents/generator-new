import yoxable from 'yoxable';
import Project from './generators/project';
import SortPkg from './generators/sort-pkg';
import Pack, { allPack } from './generators/pack';

export { Project, SortPkg, Pack };

export default yoxable({
  pkg: require('../package.json'),
  generators: [Project, SortPkg, ...allPack],
});
