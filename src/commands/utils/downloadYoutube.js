import _cliProgress from 'cli-progress';
import async from 'async';
import fs from 'fs';
import ora from 'ora';
import progress from 'progress-stream';
import youtubedl from 'youtube-dl';
import {
  filenamify,
  getFileExt,
  logger
} from '../utils';


/**
 * Download youtube video and save locally
 * @param {string} videoId Youtube video id to construct download url
 * @param {string} outputPath directory to save the file
 * @param {string} prefix file prefix
 * @param {string} title title of atom
 * @param {string} format youtube-dl quality setting (eg. best)
 */
export default function downloadYoutube(videoId, outputPath, prefix, title, format = 'best') {
  // return new Promise((resolve, reject) => {
  //   resolve('');
  // });
  
  return new Promise((resolve, reject) => {
    if (!videoId) {
      resolve('');
      return;
    }
    
    const filenameBase = `${prefix}. ${filenamify(title || '')}-${videoId}`;
    const filenameYoutube = `${filenameBase}.mp4`;
    const urlYoutube = `https://www.youtube.com/watch?v=${videoId}`;
    const savePath = `${outputPath}/${filenameYoutube}`;
    const tempPath = `${outputPath}/.${filenameYoutube}`;
    
    // avoid re-downloading videos if it already exists
    if (fs.existsSync(savePath)) {
      logger.info(`Video already exists. Skip downloading ${savePath}`);
      resolve(filenameYoutube);
      return;
    }
    
    // start youtube download
    let argsYoutube = [`--format=${format}`];    
    global.ytVerbose && argsYoutube.push('--verbose');

    const spinnerInfo = ora(`Getting Youtube video id ${videoId} information`).start();
    const video = youtubedl(urlYoutube, argsYoutube);
    
    video.on('info', info => {
      spinnerInfo.succeed();

      // get video name
      const fileSize = info.size;

      const progressStream = progress({
        length: fileSize,
        time: 20
      });
      progressStream.on('progress', progress => {
        progressBar.update(progress.transferred);
      });

      let spinnerDl;
      // create a new progress bar instance
      const progressBar = new _cliProgress.Bar({
        stopOnComplete: true
      }, _cliProgress.Presets.shades_classic);
      progressBar.start(fileSize, 0);

      // Write video to temporary file first. If download finishes, rename it
      // to proper file name later. This is to avoid the issue when the terminal
      // stop unexpectedly, when restart, the unfinished video will be
      // redownloaded
      video
        .pipe(progressStream)
        .pipe(fs.createWriteStream(tempPath));

      video.on('end', () => {
        // rename temp file to final file name
        fs.rename(tempPath, savePath, error => {
          if (error) {
            reject(error);
            return;
          }

          logger.info(`Downloaded video ${filenameYoutube}`);

          spinnerDl = ora(`Download subtitles for ${filenameYoutube}`).start();
          var options = {
            // Write automatic subtitle file (youtube only)
            auto: false,
            // Downloads all the available subtitles.
            all: true,
            // Languages of subtitles to download, separated by commas.
            lang: 'en',
            // The directory to save the downloaded files in.
            cwd: outputPath,
          };
          youtubedl.getSubs(urlYoutube, options, function(error, files) {
            if (error) {
              spinnerDl.fail();
              logger.warn(`Failed to download subtitles for ${filenameYoutube} with error:\n${error}\n`);
            }

            // loop and add prefix to each subtitle file name
            async.eachSeries(files, function(file, done) {
              // extract file extension including language code
              // eg. Average Friends - Intro to Statistics-b6mTOiKw3vQ.ar.vtt -> .ar.vtt
              const ext = getFileExt(file);

              // couldn't find file extension, skip renaming for safety
              if (!ext) {
                done();
                return;
              }

              // construct subtitle file name
              let filenameSubtitle = `${outputPath}/${filenameBase}${ext}`;

              // avoid overwriting video file
              if (fs.existsSync(filenameSubtitle)) {
                done();
                return;
              }

              fs.rename(`${outputPath}/${file}`, filenameSubtitle, function(error) {
                if (error) {
                  spinnerDl.warn();
                  logger.warn(`Failed to rename subtitles for ${file} with error:\n${error}\n`);
                }

                done();
              });
            }, function(error) {
              if (error) {
                spinnerDl.warn();
                logger.warn(`Error occur while renaming subtitle files for ${file} with error:\n${error}\n`);
              }

              spinnerDl.succeed(`Downloaded subtitles for ${filenameYoutube}`);
              resolve(filenameYoutube);
            });
          }); //.getSubs
        }); //.fs.rename

      }); //.video.on end
    }); //.video.on info

    video.on('error', error => {
      spinnerInfo.fail();      
      const { message } = error;      
      
      if (!message) {
        reject(error);
        return;
      }

      // handle video unavailable error. See node-youtube-dl source code for 
      // error message strings to check
      if (message.includes('video is unavailable')) {
        logger.error(`Youtube video with id ${videoId} is unavailable. It may have been deleted. The CLI will ignore this error and skip this download.`);
        resolve('');
      } else if (message.includes('video has been removed by the user')) {
        logger.error(`Youtube video with id ${videoId} has been removed by the user. The CLI will ignore this error and skip this download.`);
        resolve('');
      } else if (message.includes('sign in to view this video')) {
        logger.error(`Youtube video with id ${videoId} is private and require user to sign in to access it. The CLI will ignore this error and skip this download.`);
        resolve('');
      } else if (message.includes('video is no longer available')) {
        logger.error(`Youtube video with id ${videoId} is no longer available. The CLI will ignore this error and skip this download.`);
        resolve('');
      } else {
        reject(error);
      }
    });
  }); //.return Promise
}