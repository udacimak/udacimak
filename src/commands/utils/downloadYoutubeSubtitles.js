import fs from 'fs-extra';
import ora from 'ora';
import path from 'path';
import { exec } from 'youtube-dl-exec';
import { getFileExt, splitStringByLastHyphen, logger } from '.';


/**
 * Downloads YouTube subtitles and renames them to match the YouTube video file name.
 * @param {string} videoId - YouTube Video Id.
 * @param {string} filenameYoutube - YouTube filename (without extension).
 * @param {string} targetDir - Target directory.
 * @returns {Promise<Array>} - A promise that resolves to an array of subtitle information.
 * @throws {Error} - If any error occurs during the subtitle download or renaming process.
 */
export default function downloadYoutubeSubtitles(videoId, filenameYoutube, targetDir) {
  return new Promise((resolve, reject) => {
    if (!videoId) {
      resolve(null);
      return;
    }

    const spinnerSubtitles = ora(`Download subtitles for ${filenameYoutube}`).start();
    const urlYoutube = `https://www.youtube.com/watch?v=${videoId}`;
    const options = {
      'skip-download': true,
      'all-subs': true,
      'write-subs': true,
      'sub-lang': 'en.*',
      'sub-format': 'vtt',
      paths: targetDir,
    };

    exec(urlYoutube, options)
      .then(async (output) => {
        // replicating old youtube-dl behavior
        const files = [];
        const lines = output.stdout.split('\n'); // Split the output.stdout into lines

        for (let i = 0, len = lines.length; i < len; i += 1) {
          const line = lines[i];
          if (line.indexOf('[info] Writing video subtitles to: ') === 0) {
            files.push(path.basename(line.slice(35)));
          }
        }

        try {
          // loop and rename subtitle files according to video file name
          // so that video players can show subtitle
          const subtitles = [];
          for (let i = 0, len = files.length; i < len; i += 1) {
            const file = files[i];

            // extract file extension including language code
            // eg. Average Friends - Intro to Statistics-b6mTOiKw3vQ.ar.vtt -> .ar.vtt
            const ext = getFileExt(file);

            // couldn't find file extension, skip renaming for safety
            if (ext) {
              // construct subtitle file name
              const filenameSubtitle = path.join(targetDir, `${filenameYoutube}${ext}`);

              // avoid overwriting video file
              if (!fs.existsSync(filenameSubtitle)) {
                try {
                  await fs.rename(path.join(targetDir, file), filenameSubtitle);
                } catch (errorRename) {
                  spinnerSubtitles.warn();
                  logger.warn(`Failed to rename subtitles for ${file} with error:\n${errorRename}\n`);
                }

                const detectedlang = ext.split('.')[1];
                const srclang = splitStringByLastHyphen(detectedlang)[0];
                subtitles.push({
                  src: `${filenameYoutube}${ext}`,
                  srclang,
                  default: (srclang.toLowerCase().includes('en')),
                });
              } //.if fs.exist
            } //.if ext
          } //.for files
          spinnerSubtitles.succeed();
          resolve(subtitles);
        } catch (errorLoopRename) {
          spinnerSubtitles.warn();
          reject(new Error(`Failed to rename renaming subtitle files for video ${filenameYoutube} with error:\n${errorLoopRename}\n`));
        } //.trycatch
      });
  });
}
