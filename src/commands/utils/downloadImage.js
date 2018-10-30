const _cliProgress = require('cli-progress');
const fs = require('fs');
const path = require("path");
const progress = require('request-progress');
const request = require('request');
import { addHttp } from './index';
import { logger } from '../utils';


/**
 * Download image and save it as image assets
 * @see https://stackoverflow.com/questions/12740659/downloading-images-with-node-js
 * @param {string} uri URI of image
 * @param {string} outputDir output directory path
 * @param {function} filename optional file name parameter
 */
export default function downloadImage(uri, outputDir, filename = undefined) {
  // return new Promise((resolve, reject) => {
  //   resolve('');
  // });

  return new Promise((resolve, reject) => {
    if (!uri) {
      resolve('');
      return;
    }

    // add https protocol to url if missing
    uri = addHttp(uri);

    if (!filename)
      filename = path.basename(uri);
    const savePath = `${outputDir}/${filename}`;
    const tempPath = `${outputDir}/.${filename}`;

    // avoid re-downloading images if it already exists
    if (fs.existsSync(savePath)) {
      logger.info(`Image already exists. Skip downloading ${savePath}`);
      resolve(filename);
      return;
    }

    // create a new progress bar instance
    const progressBar = new _cliProgress.Bar({}, _cliProgress.Presets.shades_classic);

    let fileSize;

    // start the progress bar with a total value of 200 and start value of 0
    const headers = {
      Origin: 'https://classroom.udacity.com',
      Referer: 'https://classroom.udacity.com/me'
    };
    const requestOptions = {
      uri,
      headers
    };
    progress(request(requestOptions))
      .on('progress', state => {
        if (!fileSize) {
          logger.info(`\nDownloading image ${filename}:`);
          fileSize = state.size.total;
          progressBar.start(fileSize, 0);
        } else {
          progressBar.update(state.size.transferred);
        }
      })
      .on('response', response => {
        if (response.statusCode == 500) {
          reject(error);
        }
      })
      .on('error', error => {
        reject(error);
      })
      .on('end', () => {
        progressBar.update(fileSize);
        progressBar.stop();
      })
      // Write image to temporary file first. If download finishes, rename it
      // to proper file name later. This is to avoid the issue when the terminal
      // stop unexpectedly, when restart, the unfinished image will be
      // redownloaded
      .pipe(fs.createWriteStream(tempPath))
      .on('close', () => {
        // rename temp file to proper file name when finish
        fs.rename(tempPath, savePath, error => {
          if (error) {
            reject(error);
          }

          resolve(filename);
        });
      });
  });
}