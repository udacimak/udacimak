import {
  writeHtml,
} from '.';
import {
  filenamify,
  logger,
  markdownToHtml,
} from '../../utils';


/**
 * Write HTML file for Project Description
 * @param {object} project JSON data for project
 * @param {string} htmlSidebar sidebar html content
 * @param {string} outputPath target directory
 */
export default function writeHtmlProjectDescription(project, htmlSidebar, outputPath) {
  if (!project) {
    return;
  }

  let { description, summary, title } = project;

  description = markdownToHtml(description);
  summary = markdownToHtml(summary);
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
  const srcCss = `${upDir}assets/css`;
  const srcJs = `${upDir}assets/js`;
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
  file = `${outputPath}/${file}`;
  return writeHtml(templateDataIndex, file)
    .then(() => {
      logger.info(`Completed rendering project description file ${file}`);
      logger.info('____________________\n');
    })
    .catch((error) => {
      throw error;
    });
}
