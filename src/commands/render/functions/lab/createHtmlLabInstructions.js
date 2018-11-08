import Handlebars from 'handlebars';
import cheerio from 'cheerio';
import {
  loadTemplate,
} from '../templates';
import {
  markdownToHtml,
} from '../../../utils';


/**
 * Create HTML for Lab Instructions
 * @param {object} details instruction JSON data
 * @param {string} targetDir target directory
 */
export default function createHtmlLabInstructions(details) {
  if (!details) {
    return '(No Lab Instructions data available)';
  }

  let { text } = details;
  text = markdownToHtml(text);
  // TODO: find all media links and download them

  return loadTemplate('lab.instructions')
    .then((html) => {
      const dataTemplate = {
        text,
      };

      const template = Handlebars.compile(html);
      const htmlResult = template(dataTemplate);

      return htmlResult;
    });
}
