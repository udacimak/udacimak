import Handlebars from 'handlebars';
import {
  loadTemplate,
} from '../templates';
import { markdownToHtml } from '../../../utils';
import {
  createHtmlVideo,
  createHtmlText,
} from '../utils';


/**
 * Create HTML for Lab Introduction
 * @param {object} overview Introduction JSON data
 * @param {string} targetDir target directory
 */
export default async function createHtmlLabIntroduction(overview, labTitle, targetDir) {
  if (!overview) {
    return '(No Lab Introduction data available)';
  }

  let {
    title, summary,
  } = overview;
  const { video } = overview;
  let keyTakeaways = overview.key_takeaways;
  const mediaFileLabel = 'lab-intro';

  // process all markdown to HTML
  title = markdownToHtml(title);
  summary = await createHtmlText(summary, targetDir, mediaFileLabel);
  keyTakeaways = keyTakeaways || [];

  for (let i = 0, len = keyTakeaways.length; i < len; i += 1) {
    keyTakeaways[i] = await createHtmlText(keyTakeaways[i], targetDir, mediaFileLabel);
  }

  let htmlVideo;
  if (video && video.youtube_id) {
    htmlVideo = await createHtmlVideo(video.youtube_id, targetDir, '', labTitle);
  }

  if (!title && !summary && (!keyTakeaways || !keyTakeaways.length) && !htmlVideo) {
    return '(No Lab Introduction data available)';
  }

  const html = await loadTemplate('lab.introduction');

  const dataTemplate = {
    title,
    summary,
    keyTakeaways,
    video: htmlVideo,
  };

  const template = Handlebars.compile(html);
  const htmlResult = template(dataTemplate);

  return htmlResult;
}
