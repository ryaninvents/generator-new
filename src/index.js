import yoxable from 'yoxable';
import Project from './generators/project';
import SortPkg from './generators/sort-pkg';

export { Project, SortPkg };

export default yoxable({
  pkg: require('../package.json'),
  generators: [Project, SortPkg],
});
