#!/usr/bin/env node
import process from 'process';
import {
  retrieveUdacityAuthToken,
} from '../functions';
import {
  downloadCourse,
  downloadNanodegree,
} from './functions';
import {
  getFullErrorMessage, logger,
} from '../utils';


/**
 * Download courses/nanodegrees and save them locally
 * @param {array} courseIds list of course ids to download
 * @param {string} targetDir target directory to save downloaded courses/Nanodegrees
 */
export default async function download(courseIds, targetDir) {
  try {
    const token = await retrieveUdacityAuthToken();

    for (let i = 0, len = courseIds.length; i < len; i += 1) {
      const courseId = courseIds[i];

      let isNanodegree = false;
      // check if this is a course or Nanodegree
      if (courseId.startsWith('nd')) {
        isNanodegree = true;
      }

      if (isNanodegree) {
        await downloadNanodegree(courseId, targetDir, token);
      } else {
        await downloadCourse(courseId, targetDir, token);
      }
    }
  } catch (error) {
    const errorMsg = getFullErrorMessage(error);
    logger.error(`Failed to download course. See error below:\n${errorMsg}`);
    process.exit(1);
  }
}
