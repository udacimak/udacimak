import Handlebars from 'handlebars';
import { loadTemplate } from '../templates';
import { downloadYoutube } from '../../../utils';


/**
 * Download youtube video and and create HTML for it
 * @param {string} videoId Youtube video id to construct download url
 * @param {string} outputPath directory to save the file
 * @param {string} prefix file prefix
 * @param {string} title title of atom
 */
export default async function createHtmlVideo(videoId, outputPath, prefix, title) {
  let video;
  try {
    video = await downloadYoutube(videoId, outputPath, prefix, title);
  } catch (error) {
    throw error;
  }

  if (!video) return '';

  const html = await loadTemplate('atom.video');
  const data = {
    video,
  };
  const template = Handlebars.compile(html);
  return template(data);
}
