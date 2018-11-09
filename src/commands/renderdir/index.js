import dirTree from 'directory-tree';
import { renderCourse } from '../render/functions';
import {
  logger,
} from '../utils';


/**
 * Iterate through all directories in a source directory and render all courses
 * @param {string} sourceDir directory that contains sub-directories of
 * downloaded course JSON data from Udacity API
 * @param {string} targetDir target directory to save rendered courses
 */
export default async function renderdir(sourceDir, targetDir) {
  if (sourceDir === targetDir) {
    logger.error('Target directory must not be the same with source directory. Please change the target directory.');
    return;
  }

  const dirTreeSource = dirTree(sourceDir);
  if (!dirTreeSource) {
    logger.error('Path to downloaded Udacity course/Nanodegree doesn\'t exist.');
    return;
  }

  try {
    for (let i = 0, len = dirTreeSource.children.length; i < len; i += 1) {
      const child = dirTreeSource.children[i];
      if (child.type === 'directory') {
        const dirCourse = child.path;
        await renderCourse(dirCourse, targetDir);
      }
    }

    logger.info('Completed downloading all courses/Nanodegrees');
  } catch (error) {
    throw error;
  }
}
