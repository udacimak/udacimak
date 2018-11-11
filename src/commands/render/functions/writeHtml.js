import Handlebars from 'handlebars';
import fs from 'fs';
import { loadTemplate } from './templates';
import { getPkgInfo } from '../../utils';


/**
 * Compile HTML template and write it to HTML file
 * @param {object} data keys to parse to Handlbars for templating
 * @param {string} file path to write file to
 */
export default async function writeHtml(data, file) {
  data.pkgInfo = getPkgInfo();
  const html = await loadTemplate('index');
  const template = Handlebars.compile(html);
  const htmlResult = template(data);

  // write HTML file
  fs.writeFile(file, htmlResult, (error) => {
    if (error) {
      throw error;
    }

    return file;
  });
}
