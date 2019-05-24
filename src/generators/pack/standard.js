import Generator from 'yeoman-generator';
import { stable } from '../../util/deps';
import {
  addDevDependencies,
  updatePikaPipeline,
  builderNameMatches,
} from '../../util/updatePkg';

export default class PackStandard extends Generator {
  constructor(...args) {
    super(...args);
    this.option('typescript', {
      type: Boolean,
      required: false,
      description: 'Set to `true` to use TypeScript',
    });
  }

  async writing() {
    let packageName = '@pika/plugin-standard-pkg';
    if (this.options.typescript) {
      packageName = '@pika/plugin-ts-standard-pkg';
    }
    await addDevDependencies.call(this, stable.pick(packageName));
    await updatePikaPipeline.call(this, (prevSteps) => {
      const newStep = [
        packageName,
        {
          exclude: ['__tests__/**'],
        },
      ];

      // Make sure we don't introduce a duplicate build step
      const existingStepIndex = prevSteps.findIndex(
        builderNameMatches(packageName)
      );
      if (existingStepIndex !== -1) {
        // This builder already exists in the pipeline
        return [
          ...prevSteps.slice(0, existingStepIndex),
          newStep,
          ...prevSteps.slice(existingStepIndex + 1),
        ];
      }
      // Assume this builder comes first, since it's the transpiler.
      return [newStep, ...prevSteps];
    });
  }
}
PackStandard.key = 'pack.standard';
