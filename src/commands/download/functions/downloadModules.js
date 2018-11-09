import { downloadLessons } from '.';
import {
  filenamify,
  makeDir,
} from '../../utils';


/**
 * Loop through Nanodegree's modules and call @function downloadLessons
 * @param {object} modules parts JSON data from Nanodegree JSON
 * @param {string} ndKey Nanodegree key
 * @param {string} dirPart Nanodegree part's path
 * @param {string} udacityAuthToken Udacity authentication token
 */
export default async function downloadModules(modules, ndKey, dirPart, udacityAuthToken) {
  for (let i = 0, len = modules.length; i < len; i += 1) {
    const module = modules[i];
    const numberingModule = (i + 1 < 10) ? `0${i + 1}` : i + 1;
    const dirModuleName = filenamify(`Module ${numberingModule}_${module.title}`);
    const dirModule = makeDir(dirPart, dirModuleName);

    await downloadLessons(module.lessons, ndKey, dirModule, udacityAuthToken);
  }

  return null;
}
