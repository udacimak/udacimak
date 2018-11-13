import {
  createHtmlVideo,
} from '../utils';


/**
 * Create HTML content for VideoAtom
 * @param {object} atom atom json
 * @param {string} outputPath path to save the assets folder for videos
 * @param {string} prefix prefix for file name
 * @returns {string} HTML content
 */
export default async function createHtmlVideoAtom(atom, outputPath, prefix) {
  // create directory for video assets
  const pathVideo = outputPath;

  try {
    const html = await createHtmlVideo(atom.video.youtube_id,
      pathVideo, prefix, atom.title);

    return html;
  } catch (error) {
    throw error;
  }
}
