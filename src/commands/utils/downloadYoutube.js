import youtubedl from 'youtube-dl-exec';
import fs from 'fs';
import path from 'path';
import ora from 'ora';
import {
  filenamify,
  downloadYoutubeSubtitles,
  findVideoLocalSubtitles,
  logger,
} from '.';

/**
 * Downloads a YouTube video and saves it locally.
 * @param {string} videoId - YouTube video ID to construct download URL.
 * @param {string} outputPath - Directory to save the file.
 * @param {string} prefix - File prefix.
 * @param {string} title - Title of the video.
 * @returns {Promise<Object>} - Promise resolving an object with `src` and `subtitles` properties.
 */
export default async function downloadYoutube(videoId, outputPath, prefix, title) {
  // Check if video ID is provided
  if (!videoId) {
    logger.error('Video ID is required.');
    return null;
  }

  const filenameBase = `${prefix}. ${filenamify(title || '')}-${videoId}`;
  const filenameYoutube = `${filenameBase}.mp4`;
  const savePath = path.join(outputPath, filenameYoutube);

  // Check if video file already exists
  if (fs.existsSync(savePath)) {
    logger.info(`Video already exists. Skip downloading ${savePath}`);
    const subtitles = findVideoLocalSubtitles(filenameBase, outputPath);
    return {
      src: filenameYoutube,
      subtitles,
    };
  }

  const ytVideoQualities = ['22', '18', ''];

  // Attempt to download the video with different qualities
  for (const quality of ytVideoQualities) {
    const spinner = ora(`Downloading video with quality=${quality}`).start();
    try {
      // Use youtube-dl-exec to download the video
      await youtubedl(`https://www.youtube.com/watch?v=${videoId}`, {
        format: quality,
        output: savePath,
      });
      spinner.succeed(`Downloaded video with quality=${quality}`);
      break;
    } catch (error) {
      spinner.fail(`Failed to download video with quality=${quality}`);
      // If all qualities fail, throw an error
      if (quality === ytVideoQualities[ytVideoQualities.length - 1]) {
        throw new Error(`Failed to download video with ID ${videoId}. Error: ${error}`);
      }
    }
  }

  let subtitles = [];

  // Download subtitles if enabled
  if (global.downloadYoutubeSubtitles) {
    try {
      subtitles = await downloadYoutubeSubtitles(videoId, filenameBase, outputPath);
    } catch (error) {
      logger.warn(error);
    }
  }

  return {
    src: filenameYoutube,
    subtitles,
  };
}
