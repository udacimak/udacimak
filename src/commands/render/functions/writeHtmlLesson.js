import fs from 'fs';
import path from 'path';
import {
  writeHtmlConcept,
  writeHtmlLab,
  writeHtmlLessonSummary,
  writeHtmlProjectDescription,
  writeHtmlRubric,
} from '.';
import { createHtmlSidebarLesson } from './sidebar';
import { deleteFilesInFolder } from '../../utils';


/**
 * Iterate through lessons to trigger writing HTML files for concepts,
 * project descriptions, rubrics, etc.
 * @param {string} jsonPath directory path to look for json file
 * @param {string} targetDir output directory
 * @param {function} doneModule callback function of module loop
 */
export default async function writeHtmlLesson(jsonPath, targetDir) {
  const pathData = path.join(jsonPath, 'data.json');
  const pathRubric = path.join(jsonPath, 'rubric.json');

  // Delete all existing html files in the lesson folder if any
  // This is to make sure when the cli is updated and the new file
  // structure is different, no outdated files created from the previous cli
  // version remains.
  deleteFilesInFolder(targetDir, 'html');

  // read json file for data
  let data = fs.readFileSync(pathData, 'utf-8');
  data = JSON.parse(data);
  data = data.data.lesson;
  const { concepts, lab, project } = data;

  // try to get rubric data first if available
  const promiseRubric = new Promise((resolve) => {
    fs.access(pathRubric, fs.constants.F_OK, (error) => {
      if (error) {
        // there are no rubric.json to parse
        resolve();
        return;
      }
      fs.readFile(pathRubric, 'utf-8', (errorReadFile, rubric) => {
        if (errorReadFile) {
          throw error;
        }
        rubric = JSON.parse(rubric);
        data.rubric = rubric;
        resolve();
      });
    }); //.fs.access rubric
  }); //.promise

  try {
    await promiseRubric;

    const promises = await Promise.all([
      createHtmlSidebarLesson(data),
      writeHtmlLessonSummary(data, targetDir),
    ]);
    const htmlSidebar = promises[0];

    for (let i = 0, len = concepts.length; i < len; i += 1) {
      const conceptIndex = i + 1;
      const nextConcept = (i === len - 1) ? null : concepts[i + 1];
      await writeHtmlConcept(concepts[i], nextConcept, htmlSidebar, targetDir, conceptIndex);
    }

    let promiseWriteHtmlRubric;
    if (data.rubric) {
      promiseWriteHtmlRubric = writeHtmlRubric(data.rubric, project, htmlSidebar, targetDir);
    }

    await promiseWriteHtmlRubric;
    await writeHtmlProjectDescription(project, htmlSidebar, targetDir);
    await writeHtmlLab(lab, htmlSidebar, targetDir);
  } catch (error) {
    throw error;
  }
}
