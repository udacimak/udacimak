import fs from 'fs';
import path from 'path';


/**
 * Read a template file
 * @param {string} name name of template file
 */
export default function loadTemplate(name) {
  return new Promise((resolve, reject) => {
    const dirAppRoot = path.resolve(__dirname);
    const dirTemplates = path.resolve(dirAppRoot, '../../templates');
    const pathTemplateHtml = path.resolve(dirTemplates, `${name}.html`);

    fs.readFile(pathTemplateHtml, 'utf-8', (error, content) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(content);
    }); //.fs.readFile
  });
}