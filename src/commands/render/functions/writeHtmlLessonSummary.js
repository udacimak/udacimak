import Handlebars from 'handlebars';
import path from 'path';
import { loadTemplate } from './templates';
import { writeHtml } from '.';
import {
  filenamify,
  logger,
} from '../../utils';


/**
 * Write HTML for lesson index page to contain table of contents
 * @param {object} data JSON data of lesson
 * @param {string} targetDir output directory
 */
export default async function writeHtmlLessonSummary(data, targetDir) {
  const concepts = [];
  let lab; let project; let
    rubric;
  for (let i = 0, len = data.concepts.length; i < len; i += 1) {
    const concept = data.concepts[i];
    const prefix = i + 1 < 10 ? `0${i + 1}` : i + 1;
    const link = `${prefix}. ${filenamify(concept.title)}.html`;
    const title = `${prefix}. ${concept.title}`;
    concepts.push({
      link,
      title,
    });
  }

  if (data.project) {
    const { title } = data.project;
    const prefix = 'Project Description';
    const link = filenamify(`${prefix} - ${title}.html`);
    project = {
      link,
      title: `${prefix} - ${title}`,
    };
  } //.if project

  if (data.rubric) {
    const prefix = 'Project Rubric';
    const link = filenamify(`${prefix} - ${data.project.title}.html`);
    rubric = {
      link,
      title: `${prefix} - ${data.project.title}`,
    };
  } //.if rubric

  if (data.lab) {
    const { title } = data.lab;
    const prefix = 'Lab';
    const link = filenamify(`${prefix} - ${title}.html`);
    lab = {
      link,
      title: `${prefix} - ${title}`,
    };
  } //.if lab

  // title for html template, get it from the target directory
  let pageTitle = targetDir.split(path.sep);
  pageTitle = pageTitle[pageTitle.length - 1];

  // decide how many folders it needs to go up to access the assets
  const pathToAssets = '../';
  const file = path.join(targetDir, 'index.html');
  const html = await loadTemplate('summary.lesson');

  const template = Handlebars.compile(html);
  const dataTemplate = {
    concepts,
    lab,
    project,
    rubric,
  };
  const htmlSummary = template(dataTemplate);

  const templateDataIndex = {
    contentMain: htmlSummary,
    docTitle: pageTitle,
    pathToAssets,
    title: pageTitle,
  };

  try {
    await writeHtml(templateDataIndex, file);
    logger.info(`Completed rendering lesson summary file ${file}`);
    logger.info('____________________\n');
  } catch (error) {
    throw error;
  }
}
