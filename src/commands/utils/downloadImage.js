import _cliProgress from 'cli-progress';
import fs from 'fs';
import ora from 'ora';
import path from 'path';
import progress from 'request-progress';
import request from 'request';
import {
  addHttp,
  filenamify,
  logger,
} from '.';


/**
 * Download media file and save it as image assets
 * @see https://stackoverflow.com/questions/12740659/downloading-images-with-node-js
 * @param {string} uri URI of image
 * @param {string} outputDir output directory path
 * @param {function} filename optional file name parameter
 */
export default function downloadImage(uri, outputDir, filename = undefined) {
  const errorCheck = `Please double-check the url from the JSON data to see if the link is really broken.
If it is, it could be a broken link that Udacity hasn't fixed and you can ignore this error message.
If the link was temporary broken and is up again when you check, please re-run the render to make sure the media file will be downloaded.
`;

  return new Promise((resolve, reject) => {
    if (!uri) {
      resolve('');
      return;
    }

    // add https protocol to url if missing
    uri = addHttp(uri);

    if (!filename) {
      filename = path.basename(uri);
    }
    filename = filenamify(filename);

    const savePath = path.join(outputDir, filename);
    const tempPath = path.join(outputDir, `.${filename}`);

    // avoid re-downloading images if it already exists
    if (fs.existsSync(savePath)) {
      logger.info(`Image already exists. Skip downloading ${savePath}`);
      resolve(filename);
      return;
    }

    // create a new progress bar instance
    const progressBar = new _cliProgress.Bar({}, _cliProgress.Presets.shades_classic);
    const spinner = ora(`Download media file ${filename}`).start();
    let fileSize;

    // start the progress bar with a total value of 200 and start value of 0
    const headers = {
      Origin: 'https://classroom.udacity.com',
      Referer: 'https://classroom.udacity.com/me',
      // https://github.com/request/request/issues/2047#issuecomment-272473278
      // avoid socket hang up error
      Connection: 'keep-alive',
    };
    const requestOptions = {
      uri,
      headers,
      // avoid socket hang up error
      forever: true,
      // avoid ERR_TLS_CERT_ALTNAME_INVALID error
      // refer to https://github.com/request/request/issues/1777#issuecomment-152323328
      rejectUnauthorized: false,
    };
    progress(request(requestOptions))
      .on('progress', (state) => {
        if (!fileSize) {
          fileSize = state.size.total;
          progressBar.start(fileSize, 0);
        } else {
          progressBar.update(state.size.transferred);
        }
      })
      .on('response', (response) => {
        if (response.statusCode === 500) {
          spinner.fail();
          logger.error(`Error Status 500: Request for media file fails!
The url ${uri} returns Internal Server Error.
${errorCheck}`);
          resolve('');
        }
      })
      .on('error', (error) => {
        spinner.fail();

        if (error.code && error.code === 'ENOTFOUND') {
          logger.error(`${error.code}: Request for media file fails!
The url ${uri} doesn't seem to exist.
${errorCheck}`);
          resolve('');
        } else {
          reject(error);
        }
      })
      .on('end', () => {
        spinner.succeed();
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
        fs.rename(tempPath, savePath, (error) => {
          if (error) {
            reject(error);
          }

          logger.info(`Downloaded media file ${filename}`);
          resolve(filename);
        });
      });
  });
}
