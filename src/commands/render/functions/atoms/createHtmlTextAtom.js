import Handlebars from 'handlebars';
import {
  downloadMediaInHtml,
  markdownToHtml,
} from '../../../utils';
import { loadTemplate } from '../templates';


/**
 * Create HTML content for TextAtom
 * @param {object} atom atom json
 * @param {string} outputPath path to save the assets
 * @returns {string} HTML content
 */
export default async function createHtmlTextAtom(atom, outputPath) {
  let text = markdownToHtml(atom.text);
  text = await downloadMediaInHtml(text, outputPath, atom.id);

  const html = await loadTemplate('atom.text');
  const data = {
    text,
  };
  const template = Handlebars.compile(html);
  return template(data);
}
