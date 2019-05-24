import yoxable from 'yoxable';
import Project from './generators/project';
import SortPkg from './generators/sort-pkg';
import { allPack } from './generators/pack';

export { Project, SortPkg };

export default yoxable({
  pkg: require('../package.json'),
  generators: [Project, SortPkg, ...allPack],
});
