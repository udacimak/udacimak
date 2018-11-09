import fs from 'fs';
import ora from 'ora';
import {
  fetchNanodegree,
} from '../../../api';
import {
  checkOverwriteDir,
  downloadParts,
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
export default async function downloadNanodegree(ndKey, targetDir, udacityAuthToken) {
  logger.info(`Start downloading Nanodegree ${ndKey} from Udacity API`);
  let dirNd;
  let dirNdName;
  let ndJSON;
  let titleNd;
  const spinner = ora(`Get Nanodegree ${ndKey} information`).start();

  try {
    // validate if user is authorized to download this Nanodegree
    // and check which version to download
    const nanodegreeRes = await retrieveUserNanodegreeInfo(ndKey, udacityAuthToken);

    if (!nanodegreeRes) {
      spinner.fail();
      const _error = new Error(`Fail to find Nanodegree key ${ndKey} in your profile. The key ${ndKey} either doesn't exist or you don't have access to it.`);
      throw _error;
    }

    spinner.succeed();
    const { key, locale, version } = nanodegreeRes;
    logger.info(`You're authorized to download version ${version}, locale ${locale} of Nanodegree ${key}`);
    const res = await fetchNanodegree({ key, locale, version }, udacityAuthToken);

    ndJSON = res;
    const { nanodegree } = res.data;
    titleNd = nanodegree.title;
    // create folder for Nanoderee
    dirNdName = filenamify(`${nanodegree.title} v${nanodegree.version}`);
    // check if folder already exist and warn the user

    const shouldProceed = await checkOverwriteDir(targetDir, dirNdName);

    if (!shouldProceed) return; // TODO: check

    dirNd = makeDir(targetDir, dirNdName);
    // save Nanodegree JSON to file
    const jsonStr = JSON.stringify(ndJSON, null, 2);
    const file = `${dirNd}/data.json`;
    fs.writeFileSync(file, jsonStr);

    // loop through parts, modules, lessons to create folder
    // and download lessons
    await downloadParts(nanodegree.parts, ndKey, dirNd, udacityAuthToken);
    logger.info(`Completed downloading ${titleNd} Nanodegree's JSON data from Udacity API`);
    logger.info('____________________\n');
  } catch (error) {
    spinner.fail();
    throw error;
  }
}
