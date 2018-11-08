import async from 'async';
import fs from 'fs';
import {
  fetchCourse,
} from '../../../api';
import {
  checkOverwriteDir,
  downloadLesson,
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
export default function downloadCourse(courseId, targetDir, udacityAuthToken) {
  return new Promise((resolve, reject) => {
    let course; let dirCourse; let titleCourse; let dirCourseName; let
      courseJSON;

    return fetchCourse({ key: courseId }, udacityAuthToken)
      .then((res) => {
        courseJSON = res;
        ({ course } = res.data);
        titleCourse = course.title;
        // create folder for course
        dirCourseName = filenamify(`${course.title} v${course.version}`);
        // check if folder already exist and warn the user
        return checkOverwriteDir(targetDir, dirCourseName);
      })
      .then((shouldProceed) => {
        if (!shouldProceed) return null;

        dirCourse = makeDir(targetDir, dirCourseName);
        // save course JSON to file
        const jsonStr = JSON.stringify(courseJSON, null, 2);
        const file = `${dirCourse}/data.json`;
        fs.writeFileSync(file, jsonStr);

        return course;
      })
      .then((courseData) => {
        if (!courseData) return;

        const { lessons } = courseData;

        // loop through lessons to create folder and download lessons
        let i = 0;
        async.forEachSeries(lessons, (lesson, doneLessons) => {
          const numbering = (i + 1 < 10) ? `0${i + 1}` : i + 1;
          const dirLessonName = filenamify(`Lesson ${numbering}_${lesson.title}`);
          const dirLesson = makeDir(dirCourse, dirLessonName);

          downloadLesson(lesson, courseId, dirLesson, udacityAuthToken)
            .then(() => {
              doneLessons();
            });
          i += 1;
        }, (error) => {
          if (error) {
            reject(error);
            return;
          }

          logger.info(`Completed downloading ${titleCourse} course's JSON data from Udacity API`);
          resolve();
        }); //.async.forEachSeries lessons
      });
  }); //.Promise
}
