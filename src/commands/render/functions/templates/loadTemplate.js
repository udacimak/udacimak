import fs from 'fs-extra';
import path from 'path';


/**
 * Read a template file
 * @param {string} name name of template file
 */
export default async function loadTemplate(name) {
  const dirAppRoot = path.resolve(__dirname);
  const dirTemplates = path.resolve(dirAppRoot, '../../templates');
  const pathTemplateHtml = path.resolve(dirTemplates, `${name}.html`);

  try {
    const content = fs.readFile(pathTemplateHtml, 'utf-8');
    return content;
  } catch (error) {
    throw error;
  }
}
