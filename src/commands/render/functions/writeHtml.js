import Handlebars from 'handlebars';
import fs from 'fs';
import { loadTemplate } from './templates';


/**
 * Compile HTML template and write it to HTML file
 * @param {object} data keys to parse to Handlbars for templating
 * @param {string} file path to write file to
 */
export default function writeHtml(data, file) {
  return loadTemplate('index')
    .then(html => {
      const template = Handlebars.compile(html);
      const htmlResult = template(data);

      // write HTML file
      fs.writeFile(file, htmlResult, error => {
        if (error) {
          throw error;
        }

        return file;
      });
    });
}