import fs from 'fs-extra';
import ora from 'ora';
import path from 'path';
import youtubedl from 'youtube-dl';
import {
  downloadYoutubeSubtitles,
  filenamify,
  findVideoLocalSubtitles,
  logger,
} from '.';


/**
 * Download youtube video and save locally
 * @param {string} videoId Youtube video id to construct download url
 * @param {string} outputPath directory to save the file
 * @param {string} prefix file prefix
 * @param {string} title title of atom
 * @param {string} format youtube-dl quality setting (eg. best)
 */
export default function downloadYoutube(videoId, outputPath, prefix, title, format = 'bestvideo+bestaudio') {
  return new Promise(async (resolve, reject) => {
    if (!videoId) {
      resolve(null);
      return;
    }

    const filenameBase = `${prefix}. ${filenamify(title || '')}-${videoId}`;
    const filenameYoutube = `${filenameBase}.mp4`;
    const urlYoutube = `https://www.youtube.com/watch?v=${videoId}`;
    const savePath = path.join(outputPath, filenameYoutube); `${outputPath}/${filenameYoutube}`;
    const tempPath = path.join(outputPath, `.${filenameYoutube}`);
    let timeGap;
    let timeout = 0;

    // avoid re-downloading videos if it already exists
    if (fs.existsSync(savePath)) {
      logger.info(`Video already exists. Skip downloading ${savePath}`);
      const subtitles = findVideoLocalSubtitles(filenameBase, outputPath);
      resolve({
        src: filenameYoutube,
        subtitles,
      });
      return;
    }

    // start youtube download

    // calculate amount of time to wait before starting this next Youtube download
    if (global.previousYoutubeTimestamp) {
      // time difference between last Youtube download and this one
      timeGap = Date.now() - global.previousYoutubeTimestamp;
      const delayYoutube = global.delayYoutube * 1000;

      if (timeGap > 0 && timeGap <= delayYoutube) {
        timeout = delayYoutube - timeGap;
      } else {
        timeout = 0;
      }
    }

    // delay to avoid Youtube from detecting youtube-dl usage
    await new Promise((resolveWait) => {
      const timeoutSeconds = parseFloat(timeout / 1000).toFixed(1);
      const spinnerDelayYoutube = ora(`Delaying Youtube download for further ${timeoutSeconds} seconds`).start();
      setTimeout(() => {
        spinnerDelayYoutube.stop();
        resolveWait();
      }, timeout);
    });

    const spinnerInfo = ora(`Getting Youtube video id ${videoId} information\n`).start();

    const argsYoutube = [
      '-f',
      format,
      '-o',
      tempPath,
      '--exec',
      `mv {} "${savePath}"`,
    ];
    global.ytVerbose && argsYoutube.push('--verbose');

    // Write video to temporary file first. If download finishes, rename it
    // to proper file name later. This is to avoid the issue when the terminal
    // stop unexpectedly, when restart, the unfinished video will be
    // redownloaded
    youtubedl.exec(urlYoutube, argsYoutube, {}, async (err, output) => {
      if (err) {
        spinnerInfo.fail();
        const { message } = err;

        if (!message) {
          reject(err);
          return;
        }

        // handle video unavailable error. See node-youtube-dl source code for
        // error message strings to check
        if (message.includes('video is unavailable')) {
          logger.error(`Youtube video with id ${videoId} is unavailable. It may have been deleted. The CLI will ignore this error and skip this download.`);
          resolve(null);
        } else if (message.includes('video has been removed by the user')) {
          logger.error(`Youtube video with id ${videoId} has been removed by the user. The CLI will ignore this error and skip this download.`);
          resolve(null);
        } else if (message.includes('sign in to view this video')) {
          logger.error(`Youtube video with id ${videoId} is private and require user to sign in to access it. The CLI will ignore this error and skip this download.`);
          resolve(null);
        } else if (message.includes('video is no longer available')) {
          logger.error(`Youtube video with id ${videoId} is no longer available. The CLI will ignore this error and skip this download.`);
          resolve(null);
        } else {
          reject(err);
        }
      }

      spinnerInfo.succeed();
      output.forEach((o) => {
        logger.info(o);
      });
      logger.info(`Downloaded video ${filenameYoutube}`);

      let subtitles = [];

      if (global.downloadYoutubeSubtitles) {
        try {
          subtitles = await downloadYoutubeSubtitles(videoId, filenameBase, outputPath);
        } catch (error) {
          logger.warn(error);
        }
      } //.if downloadYoutubeSubtitles

      global.previousYoutubeTimestamp = Date.now();
      resolve({
        src: filenameYoutube,
        subtitles,
      });
    });
  }); //.return Promise
}
