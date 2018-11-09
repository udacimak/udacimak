import fs from 'fs';
import {
  fetchCourse,
} from '../../../api';
import {
  checkOverwriteDir,
  downloadLessons,
} from '.';
import {
  filenamify,
  logger,
  makeDir,
} from '../../utils';


/**
 * Download JSON data of a course from Udacity API
 * @param {string} courseId course id
 * @param {string} targetDir target directory to save downloaded course JSON
 * @param {string} udacityAuthToken Udacity authentication token
 */
export default async function downloadCourse(courseId, targetDir, udacityAuthToken) {
  try {
    const courseJSON = await fetchCourse({ key: courseId }, udacityAuthToken);
    const { course } = courseJSON.data;
    const { lessons } = course;

    const titleCourse = course.title;
    // create folder for course
    const dirCourseName = filenamify(`${course.title} v${course.version}`);

    // check if folder already exist and warn the user
    const shouldProceed = await checkOverwriteDir(targetDir, dirCourseName);
    if (!shouldProceed) return;

    const dirCourse = makeDir(targetDir, dirCourseName);
    // save course JSON to file
    const jsonStr = JSON.stringify(courseJSON, null, 2);
    const file = `${dirCourse}/data.json`;
    fs.writeFileSync(file, jsonStr);

    await downloadLessons(lessons, courseId, dirCourse, udacityAuthToken);
    logger.info(`Completed downloading ${titleCourse} course's JSON data from Udacity API`);
    logger.info('____________________\n');
  } catch (error) {
    throw error;
  }
}
