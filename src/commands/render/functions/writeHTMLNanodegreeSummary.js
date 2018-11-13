import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { loadTemplate } from './templates';
import {
  writeHtml,
} from '.';
import {
  downloadImage,
  logger,
  filenamify,
  makeDir,
  markdownToHtml,
} from '../../utils';


// TODO: refactor to use Handlebars for HTML templating
/**
 * Loop through current parentJSON's given key and create HTML list as table of content
 * @param {object} parentJSON parent JSON object
 * @param {string} key name of the key to extract section from parent JSON
 * @returns {string} HTML of given key
 */
function createHtmlSectionSummary(parentJSON, key, keyLabel, linkLesson) {
  let html = '';

  if (!parentJSON[key] || !key) return html;

  // loop through each section to create table of content
  for (let i = 0, len = parentJSON[key].length; i < len; i += 1) {
    const section = parentJSON[key][i];
    const numbering = (i + 1 < 10) ? `0${i + 1}` : i + 1;
    const prefixSection = `${keyLabel.charAt(0).toUpperCase()}${keyLabel.substr(1)} ${numbering}`;
    const linkSection = `${linkLesson}/${numbering}. ${filenamify(section.title)}.html`;
    const summary = section.summary ? `<p>${markdownToHtml(section.summary)}</p>` : '';
    html += `
      <li>
        <a href="${linkSection}"><strong>${prefixSection}:</strong> ${section.title}</a>
        ${summary}
      </li>
    `;
  }

  return html;
}

/**
 * Loop through current modules's lessons and create HTML list as table of content
 * @param {object} module Module JSON object
 * @returns {string} HTML of lessons
 */
function createHtmlLessonSummary(module, prefixModule) {
  let html = '';

  if (!module.lessons) return html;

  // loop through lessons to create table of content
  for (let i = 0, len = module.lessons.length; i < len; i += 1) {
    const lesson = module.lessons[i];
    const numbering = (i + 1 < 10) ? `0${i + 1}` : i + 1;
    const prefixLesson = `Lesson ${numbering}`;
    const linkLesson = `${prefixModule}-${prefixLesson}_${filenamify(lesson.title.trim())}`;
    const lessonSummary = lesson.summary ? `<p>${markdownToHtml(lesson.summary)}</p>` : '';
    const htmlConcepts = createHtmlSectionSummary(lesson, 'concepts', 'Concept', linkLesson);
    let htmlProjectDescription = '';
    let htmlProjectRubric = '';
    let htmlLab = '';
    if (lesson.project) {
      // create list item for project description
      const { title } = lesson.project;
      const prefixProjectDescription = 'Project Description';
      const linkProjectDescription = filenamify(`${prefixProjectDescription} - ${title}.html`);
      htmlProjectDescription = `
      <p><a href="${linkLesson}/${linkProjectDescription}">${prefixProjectDescription} - ${title}</a></p>
      `;

      // create list item for project rubric
      const prefixRubric = 'Project Rubric';
      const linkRubric = filenamify(`${prefixRubric} - ${title}.html`);
      htmlProjectRubric += `<p><a href="${linkLesson}/${linkRubric}">${prefixRubric} - ${title}</a></p>`;
    }

    if (lesson.lab) {
      // create list item for lab
      const { title } = lesson.lab;
      const prefixLab = 'Lab';
      const linkLab = filenamify(`${prefixLab} - ${title}.html`);
      htmlLab += `<p><a href="${linkLesson}/${linkLab}">${prefixLab} - ${title}</a></p>`;
    }

    html += `
      <li>
        <details>
          <summary>
            <a href="${linkLesson}/index.html"><strong>${prefixLesson}:</strong> ${lesson.title}</a>
            ${lessonSummary}
            ${htmlProjectDescription}
            ${htmlProjectRubric}
            ${htmlLab}
          </summary>
          <ul>
            ${htmlConcepts}
          </ul>
        </details>
      </li>
    `;
  } //.for module.lessons
  html = `<ul>${html}</ul>`;

  return html;
}


/**
 * Loop through current part's modules and create HTML list as table of content
 * @param {object} part Part JSON object
 * @returns {string} HTML of modules
 */
function createHtmlModuleSummary(part, prefixPart) {
  let html = '';

  if (!part.modules) return html;

  // loop through modules to create table of content
  for (let i = 0, len = part.modules.length; i < len; i += 1) {
    const module = part.modules[i];
    const numbering = (i + 1 < 10) ? `0${i + 1}` : i + 1;
    const prefixModule = `Module ${numbering}`;
    const htmlLessons = createHtmlLessonSummary(module, `${prefixPart}-${prefixModule}`);
    html += `
      <li>
        <strong>${prefixModule}:</strong> ${module.title}
        ${htmlLessons}
      </li>
    `;
  } //.for part.modules
  html = `<ul>${html}</ul>`;

  return html;
}


/**
 * Create the summary index page for a given Nanodegree
 * This includes:
 *  - Nanodegree overview
 *  - Table of contents
 * @param {string} jsonPath path to JSON file
 * @param {string} targetDir target directory
 * @param {string} nanodegreeName name of Nanodegree
 * @param {string} filename file name of source JSON file
 */
export default async function writeHTMLNanodegreeSummary(jsonPath, targetDir, nanodegreeName, filename = 'data.json') {
  const pathData = path.join(jsonPath, filename);

  // read json file for data
  let data = fs.readFileSync(pathData, 'utf-8');
  data = JSON.parse(data);
  data = data.data.nanodegree;

  // loop through parts to create the table of course content
  let htmlParts = '';
  for (let i = 0, len = data.parts.length; i < len; i += 1) {
    const part = data.parts[i];
    const numbering = (i + 1 < 10) ? `0${i + 1}` : i + 1;
    const partType = (part.part_type === 'Core') ? '' : `<em>(${part.part_type})</em>`;
    const prefixPart = `Part ${numbering}`;
    const partSummary = markdownToHtml(part.summary);

    // create html for this part's modules
    const htmlModules = createHtmlModuleSummary(part, prefixPart);
    // create html for current part
    htmlParts += `
      <div>
          <h4><strong>${prefixPart} ${partType}:</strong> ${part.title}</h4>
          <p>${partSummary}</p>
          ${htmlModules}
      </div>
    `;
  } //.for data.parts

  let pathImg;
  let heroImageUrl = '';
  if (data.hero_image) {
    // create directory for image assets
    pathImg = makeDir(targetDir, 'img');
    heroImageUrl = data.hero_image.url;
  }

  // download image to save locally then create html file
  const [filenameImg, html] = await Promise.all([
    downloadImage(heroImageUrl, pathImg),
    loadTemplate('summary.nanodegree'),
  ]);

  const {
    key,
    locale,
    version,
    title,
  } = data;
  const summary = markdownToHtml(data.summary);
  const srcHeroImg = filenameImg ? `img/${filenameImg}` : null;
  const heroImgAlt = title;

  const dataTemplate = {
    srcHeroImg,
    heroImgAlt,
    htmlParts,
    key,
    locale,
    version,
    summary,
  };
  const template = Handlebars.compile(html);
  const contentMain = template(dataTemplate);

  const templateDataIndex = {
    contentMain,
    docTitle: nanodegreeName,
    pathToAssets: '',
    title: data.title,
  };
  const file = path.join(targetDir, 'index.html');
  await writeHtml(templateDataIndex, file);

  logger.info(`Completed rendering Nanodegree summary file ${targetDir}/index.html`);
  logger.info('____________________\n');
}
