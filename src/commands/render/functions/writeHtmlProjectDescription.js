import path from 'path';
import {
  writeHtml,
} from '.';
import {
  filenamify,
  logger,
} from '../../utils';
import { createHtmlText } from './utils';


/**
 * Write HTML file for Project Description
 * @param {object} project JSON data for project
 * @param {string} htmlSidebar sidebar html content
 * @param {string} outputPath target directory
 */
export default async function writeHtmlProjectDescription(project, htmlSidebar, outputPath) {
  if (!project) {
    return;
  }

  let { description, summary } = project;
  const { title } = project;

  description = await createHtmlText(description, outputPath);
  summary = await createHtmlText(summary, outputPath);
  // create HTML body content
  const htmlSummary = summary ? `
    <p class="text-center">${summary}</p>

    <hr>
  ` : '';
  const contentMain = `
    ${htmlSummary}
    ${description}
  `;

  // decide how many folders it needs to go up to access the assets
  const upDir = '../';
  const srcCss = path.join(upDir, 'assets/css');
  const srcJs = path.join(upDir, 'assets/js');
  // write html file
  const templateDataIndex = {
    contentMain,
    docTitle: title || 'Project Description',
    sidebar: htmlSidebar,
    srcCss,
    srcJs,
    title,
  };
  let file = filenamify(`Project Description - ${title}.html`);
  file = path.join(outputPath, file);

  try {
    await writeHtml(templateDataIndex, file);
    logger.info(`Completed rendering project description file ${file}`);
    logger.info('____________________\n');
  } catch (error) {
    throw error;
  }
}
