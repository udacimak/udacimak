import Handlebars from 'handlebars';
import {
  loadTemplate,
} from '../templates';
import {
  downloadYoutube,
  markdownToHtml,
} from '../../../utils';


/**
 * Create HTML for Lab Introduction
 * @param {object} overview Introduction JSON data
 * @param {string} targetDir target directory
 */
export default function createHtmlLabIntroduction(overview, labTitle, targetDir) {
  if (!overview) {
    return '(No Lab Introduction data available)';
  }

  let {
    title, summary,
  } = overview;
  const { video } = overview;
  let keyTakeaways = overview.key_takeaways;
  let htmlVideo = '';

  // process all markdown to HTML
  title = markdownToHtml(title);
  summary = markdownToHtml(summary);
  keyTakeaways = keyTakeaways || [];

  for (let i = 0, len = keyTakeaways.length; i < len; i += 1) {
    keyTakeaways[i] = markdownToHtml(keyTakeaways[i]);
  }

  let promiseVideo;
  if (video && video.youtube_id) {
    promiseVideo = downloadYoutube(video.youtube_id, targetDir, '', labTitle);
  } else {
    promiseVideo = new Promise(resolve => resolve());
  }


  return promiseVideo
    .then((filenameYoutube) => {
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
    .then((html) => {
      console.log(title, summary, keyTakeaways, htmlVideo);
      if (!title && !summary && (!keyTakeaways || !keyTakeaways.length) && !htmlVideo) {
        return '(No Lab Introduction data available)';
      }

      const dataTemplate = {
        title,
        summary,
        keyTakeaways,
        video: htmlVideo,
      };

      const template = Handlebars.compile(html);
      const htmlResult = template(dataTemplate);

      return htmlResult;
    });
}
