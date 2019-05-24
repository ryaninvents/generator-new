import Generator from 'yeoman-generator';
import {
  addDevDependencies,
  updatePikaPipeline,
  builderNameMatches,
} from '../../util/updatePkg';
import { stable } from '../../util/deps';

const ASSETS_BUILDER_NAME = '@pika/plugin-copy-assets';
export default class PackAssets extends Generator {
  async writing() {
    await addDevDependencies.call(this, stable.pick(ASSETS_BUILDER_NAME));
    await updatePikaPipeline.call(this, (prevSteps) => {
      const newStep = [ASSETS_BUILDER_NAME];

      // Make sure we don't introduce a duplicate build step
      const existingStepIndex = prevSteps.findIndex(
        builderNameMatches(ASSETS_BUILDER_NAME)
      );
      if (existingStepIndex !== -1) {
        // This builder already exists in the pipeline.
        const existingStep = prevSteps[existingStepIndex];
        return [
          ...prevSteps.slice(0, existingStepIndex),
          // Copy over the options object. This implementation is kinda dumb
          // at the moment, but later I'll want to be able to append items
          // to the `files` array, so this will be helpful.
          [
            ...newStep,
            ...(Array.isArray(existingStep) ? existingStep.slice(1) : []),
          ],
          ...prevSteps.slice(existingStepIndex + 1),
        ];
      }

      // The position of the assets item doesn't much matter, so
      // just put it at the end.
      return [...prevSteps, newStep];
    });
  }

  async installing() {
    await this.npmInstall();
  }
}
PackAssets.key = 'pack.assets';
