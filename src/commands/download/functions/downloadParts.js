import { downloadModules } from '.';
import {
  filenamify,
  makeDir,
} from '../../utils';


/**
 * Loop through Nanodegree's parts and call @function downloadModules
 * @param {object} parts parts JSON data from Nanodegree JSON
 * @param {string} ndKey Nanodegree key
 * @param {string} dirNd Nanodegree's path
 * @param {string} udacityAuthToken Udacity authentication token
 */
export default async function downloadParts(parts, ndKey, dirNd, udacityAuthToken) {
  for (let i = 0, len = parts.length; i < len; i += 1) {
    const part = parts[i];
    const numberingPart = (i + 1 < 10) ? `0${i + 1}` : i + 1;
    const dirPartName = filenamify(`Part ${numberingPart}_${part.title}`);
    const dirPart = makeDir(dirNd, dirPartName);

    await downloadModules(part.modules, ndKey, dirPart, udacityAuthToken);
  }

  return null;
}
