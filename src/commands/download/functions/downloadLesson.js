import fs from 'fs';
import {
  fetchLesson,
} from '../../../api';
import {
  logger,
} from '../../utils';
import {
  downloadProjectRubric,
} from '.';


/**
 * Download lesson JSON data and save it locally
 * @param {object} lesson lesson JSON data from Nanodegree JSON
 * @param {string} root_key Nanodegree key
 * @param {string} targetDir target directory to save JSON file
 * @param {string} token Udacity authentication token
 */
export default function downloadLesson(lesson, rootKey, targetDir, token) {
  const { id, locale, project } = lesson;
  // if lesson contains a project, flag to Project Rubric
  let shouldDownloadRubric = false;
  if (project) {
    shouldDownloadRubric = true;
  }

  return fetchLesson({ id, locale, rootKey }, token)
    .then((res) => {
      const jsonStr = JSON.stringify(res, null, 2);
      const file = `${targetDir}/data.json`;
      // save JSON file
      fs.writeFileSync(file, jsonStr);
      logger.info(`Downloaded lesson JSON for ${targetDir}`);
    })
    .then(() => {
      if (!shouldDownloadRubric) return null;

      // download Project rubric
      return downloadProjectRubric(project, targetDir, token);
    });
}
