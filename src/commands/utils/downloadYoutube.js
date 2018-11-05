import _cliProgress from 'cli-progress';
import async from 'async';
import fs from 'fs';
import process from 'process';
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
    const video = youtubedl(urlYoutube, argsYoutube);
    video.on('info', info => {
      // get video name
      const fileSize = info.size;

      const progressStream = progress({
        length: fileSize,
        time: 20
      });
      progressStream.on('progress', progress => {
        progressBar.update(progress.transferred);
      });

      logger.info(`\nDownloading video ${filenameYoutube}:`);
      // create a new progress bar instance
      const progressBar = new _cliProgress.Bar({}, _cliProgress.Presets.shades_classic);
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

          progressBar.update(fileSize);
          progressBar.stop();

          logger.info(`Downloading subtitles for ${filenameYoutube}`);
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
                  logger.warn(`Failed to rename subtitles for ${file} with error:\n${error}\n`);
                }

                done();
              });
            }, function(error) {
              if (error) {
                logger.warn(`Failed to rename subtitles for ${file} with error:\n${error}\n`);
              }

              logger.info(`Downloaded subtitles for ${filenameYoutube}`);
              resolve(filenameYoutube);
            });
          }); //.getSubs
        }); //.fs.rename

      }); //.video.on end
    }); //.video.on info
  }); //.return Promise
}