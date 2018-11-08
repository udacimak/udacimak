import fs from 'fs';
import {
  fetchProjectRubric,
} from '../../../api';
import {
  logger,
} from '../../utils';


/**
 * Download project rubric JSON data and save it locally
 * @param {object} project project JSON data
 * @param {string} targetDir target directory to save JSON file
 * @param {string} token Udacity authentication token
 */
export default function downloadProjectRubric(project, targetDir, token) {
  return fetchProjectRubric(project.rubric_id, token)
    .then((res) => {
      const jsonStr = JSON.stringify(res, null, 2);
      const file = `${targetDir}/rubric.json`;
      // save JSON file
      fs.writeFileSync(file, jsonStr);
      logger.info(`Downloaded rubric JSON of project ${project.title} for ${targetDir}`);
    });
}
