import {
  downloadYoutube
} from '../../../utils';


/**
 * Create HTML content for VideoAtom
 * @param {object} atom atom json
 * @param {string} outputPath path to save the assets folder for videos
 * @param {string} prefix prefix for file name
 * @returns {string} HTML content
 */
export default function createHtmlVideoAtom(atom, outputPath, prefix) {
  return new Promise((resolve, reject) => {
    // create directory for video assets
    const pathVideo = outputPath;

    downloadYoutube(atom.video.youtube_id, pathVideo, prefix, atom.title).then(filenameYoutube => {
      const html = `
        <video controls>
          <source src="${filenameYoutube}" type="video/mp4">
        </video>
      `;

      resolve(html);
    }).catch(error => {
      reject(error);
    });
  });
}