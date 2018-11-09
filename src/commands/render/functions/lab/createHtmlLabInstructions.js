import Handlebars from 'handlebars';
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
export default async function createHtmlLabInstructions(details) {
  if (!details) {
    return '(No Lab Instructions data available)';
  }

  let { text } = details;
  text = markdownToHtml(text);
  // TODO: find all media links and download them

  const html = await loadTemplate('lab.instructions');

  const dataTemplate = {
    text,
  };

  const template = Handlebars.compile(html);
  return template(dataTemplate);
}
