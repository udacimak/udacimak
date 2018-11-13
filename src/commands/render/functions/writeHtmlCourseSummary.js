import Handlebars from 'handlebars';
import fs from 'fs-extra';
import path from 'path';
import { loadTemplate } from './templates';
import {
  writeHtml,
} from '.';
import {
  filenamify,
  markdownToHtml,
} from '../../utils';


function createHtmlConceptSummary(concepts, linkLesson) {
  if (!concepts) return '';

  let html = '';
  for (let i = 0, len = concepts.length; i < len; i += 1) {
    const concept = concepts[i];
    const numbering = (i + 1 < 10) ? `0${i + 1}` : i + 1;
    const prefix = `Concept ${numbering}`;
    const title = concept.title ? concept.title : '';
    const link = path.join(linkLesson, filenamify(`${numbering}. ${title}.html`));
    html += `
      <li>
        <a href="${link}"><strong>${prefix}:</strong> ${title}</a>
      </li>
    `;
  }

  return html;
}

function createHtmlCourseLessonSummary(lessons) {
  if (!lessons) return '';

  let html = '';
  for (let i = 0, len = lessons.length; i < len; i += 1) {
    const lesson = lessons[i];
    const numbering = (i + 1 < 10) ? `0${i + 1}` : i + 1;
    const prefix = `Lesson ${numbering}`;
    const pathLesson = `${prefix}_${filenamify(lesson.title.trim())}`;
    const link = path.join(pathLesson, 'index.html');
    const summary = lesson.summary ? `<p>${markdownToHtml(lesson.summary)}` : '';
    const htmlConcepts = createHtmlConceptSummary(lesson.concepts, pathLesson);

    html += `
    <li>
      <details>
        <summary>
          <a href="${link}"><strong>${prefix}:</strong> ${lesson.title}</a>
          ${summary}
        </summary>
        <ul>
          ${htmlConcepts}
        </ul>
      </details>
    </li>
    `;
  }

  return `<ul>${html}</ul>`;
}

export default async function writeHtmlCourseSummary(jsonPath, targetDir, courseName) {
  const pathData = path.join(jsonPath, 'data.json');

  let course;
  // read json file for data
  try {
    let data = await fs.readFile(pathData, 'utf-8');
    data = JSON.parse(data);
    ({ course } = data.data);
  } catch (error) {
    throw error;
  }

  // loop through lessons to create the table of course content
  const htmlCourseLessons = createHtmlCourseLessonSummary(course.lessons);

  const html = await loadTemplate('summary.course');

  const {
    key,
    version,
    title,
    locale,
  } = course;

  const templateDataCourseSummary = {
    key,
    locale,
    htmlCourseLessons,
    version,
  };
  const template = Handlebars.compile(html);
  const contentMain = template(templateDataCourseSummary);

  const templateDataIndex = {
    contentMain,
    docTitle: courseName,
    pathToAssets: '',
    title,
  };

  const filePath = path.join(targetDir, 'index.html');
  await writeHtml(templateDataIndex, filePath);
}
