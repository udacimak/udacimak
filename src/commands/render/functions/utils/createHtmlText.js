import {
  downloadMediaInHtml,
  markdownToHtml,
} from '../../../utils';


/**
 * Convert markdown text to HTML and find media links in the text to download
 * @param {string} text markdown text
 * @param {string} targetDir target directory to pass to
 * @function downloadMediaInHtml to save the file
 * @param {string} label to label the media file
 */
export default async function createHtmlText(text, targetDir, label) {
  let html = markdownToHtml(text);
  html = await downloadMediaInHtml(html, targetDir, label);

  return html;
}
