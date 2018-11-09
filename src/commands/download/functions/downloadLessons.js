import { downloadLesson } from '.';
import {
  filenamify,
  makeDir,
} from '../../utils';


/**
 * Loop through lessons and call @function downloadLesson
 * to download the lesson JSON data
 * @param {object} lessons lessons JSON data from Nanodegree JSON
 * @param {string} ndKey Nanodegree key
 * @param {string} dirCourse Nanodegree part's path or free course's path
 * @param {string} udacityAuthToken Udacity authentication token
 */
export default async function downloadLessons(lessons, courseId, dirCourse, udacityAuthToken) {
  for (let i = 0, len = lessons.length; i < len; i += 1) {
    try {
      const lesson = lessons[i];
      const numbering = (i + 1 < 10) ? `0${i + 1}` : i + 1;
      const dirLessonName = filenamify(`Lesson ${numbering}_${lesson.title}`);
      const dirLesson = makeDir(dirCourse, dirLessonName);
      await downloadLesson(lesson, courseId, dirLesson, udacityAuthToken);
    } catch (error) {
      throw error;
    }
  }

  return null;
}
