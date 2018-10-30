#!/usr/bin/env node
import async from 'async';
import {
  retrieveUdacityAuthToken
} from '../functions';
import {
  downloadCourse,
  downloadNanodegree
} from './functions';


/**
 * Download courses/nanodegrees and save them locally
 * @param {array} courseIds list of course ids to download
 * @param {string} targetDir target directory to save downloaded courses/Nanodegrees
 */
export default function download(courseIds, targetDir) {
  retrieveUdacityAuthToken()
    .then(token => {
      async.eachSeries(courseIds, function(courseId, doneCourseIds) {
        let isNanodegree = false;
        // check if this is a course or Nanodegree
        if (courseId.startsWith('nd')) {
          isNanodegree = true;
        }

        let promise;
        if (isNanodegree) {
          promise = downloadNanodegree(courseId, targetDir, token)
        } else {
          promise = downloadCourse(courseId, targetDir, token);
        }

        promise
          .then(() => {
            doneCourseIds();
          })
          .catch(error => {
            throw error;
          });
      }, error => {
        if (error) throw error;
      });
    })
    .catch(error => {
      throw error;
    })
}