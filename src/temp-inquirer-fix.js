import Generator from 'yeoman-generator';
import { prompt as inqPrompt } from 'inquirer';

Generator.prototype.prompt = inqPrompt;
