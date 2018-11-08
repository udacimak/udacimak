import {
  writeHtmlConcept,
  writeHtmlLab,
  writeHtmlLessonSummary,
  writeHtmlProjectDescription,
  writeHtmlRubric,
} from '.';
import { createHtmlSidebarLesson } from './sidebar';
import { deleteFilesInFolder } from '../../utils';

const async = require('async');
const fs = require('fs');


/**
 * Iterate through lessons to trigger writing HTML files for concepts,
 * project descriptions, rubrics, etc.
 * @param {string} jsonPath directory path to look for json file
 * @param {string} targetDir output directory
 * @param {function} doneModule callback function of module loop
 */
export default function writeHtmlLesson(jsonPath, targetDir, doneModule) {
  const filename = 'data.json';
  const pathData = `${jsonPath}/${filename}`;
  const pathRubric = `${jsonPath}/rubric.json`;

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

  promiseRubric
    .then(() => Promise.all([
      createHtmlSidebarLesson(data),
      writeHtmlLessonSummary(data, targetDir),
    ]))
    .then((res) => {
      const htmlSidebar = res[0];

      let i = 1;
      async.eachSeries(concepts, (concept, doneLesson) => {
        writeHtmlConcept(concept, htmlSidebar, targetDir, i, doneLesson);
        i += 1;
      }, (error) => {
        if (error) throw error;
        let promiseWriteHtmlRubric;
        if (data.rubric) {
          promiseWriteHtmlRubric = writeHtmlRubric(data.rubric, project, htmlSidebar, targetDir);
        }
        Promise.all([
          promiseWriteHtmlRubric,
          writeHtmlProjectDescription(project, htmlSidebar, targetDir),
          writeHtmlLab(lab, htmlSidebar, targetDir),
        ]).then(() => {
          doneModule();
        }).catch((errorPromiseAll) => {
          throw errorPromiseAll;
        });
      }); //.async.eachSeries concepts
    })
    .catch((error) => {
      throw error;
    }); //.promiseRubric
}
