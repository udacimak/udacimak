import Handlebars from 'handlebars';
import filenamify from 'filenamify';
import { loadTemplate } from './templates';
import { writeHtml } from '.';
import {
  logger,
} from '../../utils';


/**
 * Write HTML for sidebar which contains table of contents for data.concepts
 * @param {object} data JSON data of lesson
 * @param {string} targetDir output directory
 */
export default function writeHtmlLessonSummary(data, targetDir) {
  const concepts = [];
  let lab; let project; let
    rubric;
  for (let i = 0, len = data.concepts.length; i < len; i++) {
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

  // title for html template
  let pageTitle = targetDir.split('/');
  pageTitle = pageTitle[pageTitle.length - 1];

  // decide how many folders it needs to go up to access the assets
  const upDir = '../';
  const srcCss = `${upDir}assets/css`;
  const srcJs = `${upDir}assets/js`;
  const file = `${targetDir}/index.html`;
  return loadTemplate('summary.lesson')
    .then((html) => {
      const template = Handlebars.compile(html);
      const dataTemplate = {
        concepts,
        lab,
        project,
        rubric,
      };
      const htmlSummary = template(dataTemplate);

      return {
        contentMain: htmlSummary,
        docTitle: pageTitle,
        srcCss,
        srcJs,
        title: pageTitle,
      };
    })
    .then(templateDataIndex => writeHtml(templateDataIndex, file))
    .then(() => {
      logger.info(`Completed rendering lesson summary file ${file}`);
      logger.info('____________________\n');
    })
    .catch((error) => {
      throw error;
    });
}
