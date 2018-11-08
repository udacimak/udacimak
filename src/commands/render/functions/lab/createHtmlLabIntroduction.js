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
    title, summary, key_takeaways, video,
  } = overview;
  let htmlVideo = '';

  // process all markdown to HTML
  title = markdownToHtml(title);
  summary = markdownToHtml(summary);
  key_takeaways = key_takeaways || [];

  for (let takeaway of key_takeaways) {
    takeaway = markdownToHtml(takeaway);
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
      console.log(title, summary, key_takeaways, htmlVideo);
      if (!title && !summary && (!key_takeaways || !key_takeaways.length) && !htmlVideo) {
        return '(No Lab Introduction data available)';
      }

      const dataTemplate = {
        title,
        summary,
        key_takeaways,
        video: htmlVideo,
      };

      const template = Handlebars.compile(html);
      const htmlResult = template(dataTemplate);

      return htmlResult;
    });
}
