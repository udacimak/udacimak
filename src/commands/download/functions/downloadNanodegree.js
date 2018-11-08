import async from 'async';
import fs from 'fs';
import ora from 'ora';
import {
  fetchNanodegree,
} from '../../../api';
import {
  checkOverwriteDir,
  downloadLesson,
  retrieveUserNanodegreeInfo,
} from '.';
import {
  filenamify,
  logger,
  makeDir,
} from '../../utils';


/**
 * Download JSON data of a Nanodegree from Udacity API
 * @param {string} ndKey Nanodegree key
 * @param {string} targetDir target directory to save downloaded Nanodegree
 * @param {string} udacityAuthToken Udacity authentication token
 */
export default function downloadNanodegree(ndKey, targetDir, udacityAuthToken) {
  return new Promise((resolve, reject) => {
    logger.info(`Start downloading Nanodegree ${ndKey} from Udacity API`);
    let dirNd;
    let dirNdName;
    let ndJSON;
    let titleNd;
    const spinner = ora(`Get Nanodegree ${ndKey} information`).start();

    // validate if user is authorized to download this Nanodegree
    // and check which version to download
    return retrieveUserNanodegreeInfo(ndKey, udacityAuthToken)
      .then((nanodegree) => {
        if (!nanodegree) {
          spinner.fail();
          const _error = new Error(`Fail to find Nanodegree key ${ndKey} in your profile. The key ${ndKey} either doesn't exist or you don't have access to it.`);
          reject(_error);
          return null;
        }

        const { key, locale, version } = nanodegree;
        spinner.succeed();
        logger.info(`You're authorized to download version ${version}, locale ${locale} of Nanodegree ${key}`);

        return { key, locale, version };
      })
      .catch((error) => {
        spinner.fail();
        reject(error);
      })
      .then(ndInfo => fetchNanodegree(ndInfo, udacityAuthToken))
      .then((res) => {
        ndJSON = res;
        const { nanodegree } = res.data;
        titleNd = nanodegree.title;
        // create folder for Nanoderee
        dirNdName = filenamify(`${nanodegree.title} v${nanodegree.version}`);
        // check if folder already exist and warn the user
        return {
          shouldProceed: checkOverwriteDir(targetDir, dirNdName),
          nanodegree,
        };
      })
      .then(({ shouldProceed, nanodegree }) => {
        if (!shouldProceed) return null;

        dirNd = makeDir(targetDir, dirNdName);
        // save Nanodegree JSON to file
        const jsonStr = JSON.stringify(ndJSON, null, 2);
        const file = `${dirNd}/data.json`;
        fs.writeFileSync(file, jsonStr);

        return nanodegree;
      })
      .then((nanodegreeData) => {
        if (!nanodegreeData) return;

        // loop through parts, modules, lessons to create folder
        // and download lessons
        const { parts } = nanodegreeData;

        let i = 0;
        async.forEachSeries(parts, (part, doneParts) => {
          const numberingPart = (i + 1 < 10) ? `0${i + 1}` : i + 1;
          const dirPartName = filenamify(`Part ${numberingPart}_${part.title}`);
          const dirPart = makeDir(dirNd, dirPartName);

          // create module folders
          const { modules } = part;
          let j = 0;
          async.forEachSeries(modules, (module, doneModules) => {
            const numberingModule = (j + 1 < 10) ? `0${j + 1}` : j + 1;
            const dirModuleName = filenamify(`Module ${numberingModule}_${module.title}`);
            const dirModule = makeDir(dirPart, dirModuleName);

            const { lessons } = module;
            let k = 0;
            async.forEachSeries(lessons, (lesson, doneLessons) => {
              const numberingLesson = (k + 1 < 10) ? `0${k + 1}` : k + 1;
              const dirLessonName = filenamify(`Lesson ${numberingLesson}_${lesson.title}`);
              const dirLesson = makeDir(dirModule, dirLessonName);

              downloadLesson(lesson, ndKey, dirLesson, udacityAuthToken)
                .then(() => {
                  doneLessons();
                })
                .catch((errorDownloadLesson) => {
                  throw errorDownloadLesson;
                });
              k += 1;
            }, (error) => {
              if (error) {
                reject(error);
                return;
              }
              doneModules();
            }); //.async.forEachSeries lessons
            j += 1;
          }, (error) => {
            if (error) {
              reject(error);
              return;
            }
            doneParts();
          }); //.async.forEachSeries modules
          i += 1;
        }, (error) => {
          if (error) {
            reject(error);
            return;
          }

          logger.info(`Completed downloading ${titleNd} Nanodegree's JSON data from Udacity API`);
          resolve();
        }); //.async.forEachSeries parts
      });
  }); //.Promise
}
