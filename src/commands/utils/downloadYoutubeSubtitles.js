import fs from 'fs-extra';
import ora from 'ora';
import path from 'path';
import { exec } from 'youtube-dl-exec';
import { getFileExt, logger } from '.';

/**
 * Downloads YouTube subtitles and renames them to match the YouTube video file name.
 * @param {string} videoId - YouTube Video Id.
 * @param {string} filenameYoutube - YouTube filename (without extension).
 * @param {string} targetDir - Target directory.
 * @returns {Promise<Array>} - A promise that resolves to an array of subtitle information.
 * @throws {Error} - If any error occurs during the subtitle download or renaming process.
 */
export default function downloadYoutubeSubtitles(videoId, filenameYoutube, targetDir) {
  if (!videoId || !videoId.trim()) {
    throw new Error('Invalid videoId');
  }

  const spinnerSubtitles = ora(`Download subtitles for ${filenameYoutube}`).start();
  const urlYoutube = `https://www.youtube.com/watch?v=${videoId}`;
  const options = {
    'all-subs': true,
    listSubs: true,
    output: targetDir,
  };

  return new Promise((resolve, reject) => {
    exec(urlYoutube, options)
      .then(async (output) => {
        const files = output.map(({ ext }) => ext);

        try {
          const subtitles = [];

          // Loop through the subtitle files
          for (let i = 0, len = files.length; i < len; i += 1) {
            const ext = getFileExt(files[i]);

            if (ext) {
              const filenameSubtitle = path.join(targetDir, `${filenameYoutube}${ext}`);

              if (!fs.existsSync(filenameSubtitle)) {
                try {
                  // Download the subtitle file
                  await exec(urlYoutube, {
                    writeAutoSub: true,
                    subFormat: files[i],
                    output: path.join(targetDir, `${filenameYoutube}.${ext}`),
                  });
                } catch (errorDownload) {
                  spinnerSubtitles.warn();
                  logger.warn(`Failed to download subtitle ${files[i]} with error:\n${errorDownload}\n`);
                }

                const srclang = ext.split('.')[1];
                subtitles.push({
                  src: `${filenameYoutube}${ext}`,
                  srclang,
                  default: srclang.toLowerCase() === 'en' || srclang.toLowerCase() === 'en-us',
                });
              }
            }
          }

          spinnerSubtitles.succeed();
          resolve(subtitles);
        } catch (errorLoopRename) {
          spinnerSubtitles.warn();
          reject(new Error(`Failed to rename subtitle files for video ${filenameYoutube} with error:\n${errorLoopRename}\n`));
        }
      })
      .catch((errorGetSubs) => {
        spinnerSubtitles.fail();
        reject(new Error(`Failed to download subtitles for ${filenameYoutube} with error:\n${errorGetSubs}\n`));
      });
  });
}
