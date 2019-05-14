import pick from 'lodash/pick';

function createVersions(spec) {
  return {
    pick(...pkgNames) {
      return pick(spec, ...pkgNames);
    },
  };
}

export const stable = createVersions({});
export const next = createVersions({});
