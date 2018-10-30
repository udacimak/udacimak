import Handlebars from 'handlebars';
import {
  loadTemplate
} from '../../functions/templates';
import {
  downloadYoutube,
  markdownToHtml
} from '../../../utils';


/**
 * Create HTML for Lab Introduction
 * @param {object} overview Introduction JSON data
 * @param {string} targetDir target directory
 */
export default function createHtmlLabIntroduction(overview, labTitle, targetDir) {
  if (!overview) {
    return new Promise((resolve) => resolve());
  }

  let { title, summary, key_takeaways, video } = overview;
  let htmlVideo = '';

  // process all markdown to HTML
  title = markdownToHtml(title);
  summary = markdownToHtml(summary);
  for (let takeaway of key_takeaways) {
    takeaway = markdownToHtml(takeaway);
  }

  let promiseVideo;
  if (video && video.youtube_id) {
    promiseVideo = downloadYoutube(video.youtube_id, targetDir, '', labTitle);
  } else {
    promiseVideo = new Promise((resolve) => resolve());
  }


  return promiseVideo
    .then(filenameYoutube => {
      if (!filenameYoutube) {
        return;
      }

      htmlVideo = `
        <video controls>
          <source src="${filenameYoutube}" type="video/mp4">
        </video>
      `;
    })
    .then(() => loadTemplate('lab.introduction'))
    .then(html => {
      const dataTemplate = {
        title,
        summary,
        key_takeaways,
        video: htmlVideo
      };

      const template = Handlebars.compile(html);
      const htmlResult = template(dataTemplate);

      return htmlResult;
    });
}