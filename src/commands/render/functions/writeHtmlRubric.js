import {
  writeHtml,
} from '.';
import {
  filenamify,
  logger,
  markdownToHtml,
} from '../../utils';
import {
  createHtmlRubricSections,
} from './rubric';


/**
 * Create HTML file for a project rubric
 * @param {object} rubric JSON data for project rubric
 * @param {object} projectJSON JSON data for project (from lesson parent JSON key)
 * @param {string} htmlSidebar sidebar html content
 * @param {string} outputPath target directory
 */
export default function writeHtmlRubric(rubric, projectJSON, htmlSidebar, outputPath) {
  const { sections } = rubric;
  // need to use the project title from projectJSON instead of from the rubric
  // This allow the Nanodegree and lesson summary pages to be able to link
  // to the correct file because they only have access to projectJSON object.
  const { title } = projectJSON;

  // create html rubric
  let htmlRubric = createHtmlRubricSections(sections);

  // create html for standout tips if available
  if (rubric.stand_out) {
    const standout = markdownToHtml(rubric.stand_out);
    htmlRubric += `
      <div class="jumbotron">
        <h3>Tips to make your project standout:</h3>
        <p>${standout}</p>
      </div>
    `;
  }

  // decide how many folders it needs to go up to access the assets
  const upDir = '../';
  const srcCss = `${upDir}assets/css`;
  const srcJs = `${upDir}assets/js`;
  // write html file
  const templateDataIndex = {
    contentMain: htmlRubric,
    docTitle: title,
    sidebar: htmlSidebar,
    srcCss,
    srcJs,
    title,
  };
  let file = filenamify(`Project Rubric - ${title}.html`);
  file = `${outputPath}/${file}`;
  return writeHtml(templateDataIndex, file)
    .then(() => {
      logger.info(`Completed rendering rubric file ${file}`);
      logger.info('____________________\n');
    });
}
