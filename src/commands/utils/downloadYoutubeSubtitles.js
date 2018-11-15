import fs from 'fs-extra';
import ora from 'ora';
import path from 'path';
import youtubedl from 'youtube-dl';
import {
  getFileExt,
  logger,
} from '.';


/**
 * Download Youtube subtitles and rename them to be the same as Youtube video
 * file name
 * @param {string} videoId Youtube Video Id
 * @param {string} filenameYoutube Youtube filename (without extension)
 * @param {string} targetDir target directory
 */
export default function downloadYoutubeSubtitles(videoId, filenameYoutube, targetDir) {
  if (!videoId || !videoId.trim()) {
    return null;
  }

  const spinnerSubtitles = ora(`Download subtitles for ${filenameYoutube}`).start();
  const urlYoutube = `https://www.youtube.com/watch?v=${videoId}`;
  const options = {
    // Write automatic subtitle file (youtube only)
    auto: false,
    // Downloads all the available subtitles.
    all: true,
    // Languages of subtitles to download, separated by commas.
    lang: 'en',
    // The directory to save the downloaded files in.
    cwd: targetDir,
  };

  return new Promise((resolve, reject) => {
    youtubedl.getSubs(urlYoutube, options, async (errorGetSubs, files) => {
      if (errorGetSubs) {
        spinnerSubtitles.fail();
        reject(new Error(`Failed to download subtitles for ${filenameYoutube} with error:\n${errorGetSubs}\n`));
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

              const srclang = ext.split('.')[1];
              subtitles.push({
                src: `${filenameYoutube}${ext}`,
                srclang,
                default: (srclang.toLowerCase() === 'en' || srclang.toLowerCase() === 'en-us'),
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
    }); //.getSubs
  });
}
