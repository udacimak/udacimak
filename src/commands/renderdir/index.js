import async from 'async';
import dirTree from 'directory-tree';
import { renderCourse } from '../render/functions';
import {
  logger,
} from '../utils';


/**
 * Iterate through all directories in a source directory and render all courses
 * @param {string} sourceDir directory that contains sub-directories of downloaded course JSON data from Udacity API
 * @param {string} targetDir target directory to save rendered courses
 */
export default function renderdir(sourceDir, targetDir) {
  if (sourceDir === targetDir) {
    const _error = new Error('Target directory must not be the same with source directory. Please change the target directory.');
    reject(_error);
    return;
  }

  const dirTreeSource = dirTree(sourceDir);
  if (!dirTreeSource) {
    logger.error('Path to downloaded Udacity course/Nanodegree doesn\'t exist.');
    return;
  }

  // loop through each
  async.forEachSeries(dirTreeSource.children, (child, done) => {
    if (child.type !== 'directory') {
      done();
      return;
    }

    const dirCourse = child.path;
    renderCourse(dirCourse, targetDir)
      .then(() => {
        done();
      })
      .catch((error) => {
        logger.error(error);
      });
  }, (error) => {
    if (error) {
      logger.error(error);
      return;
    }

    logger.info('Completed downloading all courses/Nanodegrees');
  });
}
