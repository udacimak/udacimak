import youtubedl from 'youtube-dl-exec'; // Import youtube-dl-exec
import fs from 'fs';
import path from 'path';
import ora from 'ora';

export default async function downloadYoutube(videoId, outputPath, prefix, title) {
  if (!videoId) {
    console.log('Video ID is required.');
    return;
  }

  const filenameBase = `${prefix}. ${title || ''}-${videoId}`;
  const filenameYoutube = `${filenameBase}.mp4`;
  const savePath = path.join(outputPath, filenameYoutube);

  // Avoid re-downloading videos if it already exists
  if (fs.existsSync(savePath)) {
    console.log(`Video already exists. Skip downloading ${savePath}`);
    return;
  }

  // Start youtube download
  const ytVideoQualities = ['22', '18', ''];
  for (let i = 0; i < ytVideoQualities.length; i += 1) {
    const spinner = ora(`Downloading video with quality=${ytVideoQualities[i]}`).start();
    try {
      // Use youtube-dl-exec to download the video
      await youtubedl(`https://www.youtube.com/watch?v=${videoId}`, {
        format: ytVideoQualities[i],
        output: savePath,
      });
      spinner.succeed(`Downloaded video with quality=${ytVideoQualities[i]}`);
      break;
    } catch (error) {
      spinner.fail(`Failed to download video with quality=${ytVideoQualities[i]}`);
      if (i === ytVideoQualities.length - 1) {
        console.error(`Failed to download video with id ${videoId}. Error: ${error}`);
      }
    }
  }
}
