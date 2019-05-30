import Generator from 'yeoman-generator';
import {
  addDevDependencies,
  updatePikaPipeline,
  builderNameMatches,
  builderNameEndsWith,
} from '../../util/updatePkg';
import { stable } from '../../util/deps';

const NODE_BUILDER_NAME = '@pika/plugin-build-node';
export default class PackNode extends Generator {
  async writing() {
    await addDevDependencies.call(this, stable.pick(NODE_BUILDER_NAME));
    await updatePikaPipeline.call(this, (prevSteps) => {
      const newStep = [
        NODE_BUILDER_NAME,
        {
          minNodeVersion: '8',
        },
      ];

      // Make sure we don't introduce a duplicate build step
      const existingStepIndex = prevSteps.findIndex(
        builderNameMatches(NODE_BUILDER_NAME)
      );
      if (existingStepIndex !== -1) {
        // This builder already exists in the pipeline
        return [
          ...prevSteps.slice(0, existingStepIndex),
          newStep,
          ...prevSteps.slice(existingStepIndex + 1),
        ];
      }

      const standardStepIndex = prevSteps.findIndex(
        builderNameEndsWith('standard-pkg')
      );
      if (standardStepIndex === -1) {
        return [...prevSteps, newStep];
      }

      return [
        ...prevSteps.slice(0, standardStepIndex),
        newStep,
        ...prevSteps.slice(standardStepIndex),
      ];
    });
  }

  async installing() {
    await this.npmInstall();
  }
}
PackNode.key = 'pack:node';
