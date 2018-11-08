import async from 'async';
import Handlebars from 'handlebars';
import {
  createHtmlImageAtom,
  createHtmlTaskListAtom,
  createHtmlTextAtom,
  createHtmlVideoAtom,
  createHtmlCheckboxQuizAtom,
  createHtmlMatchingQuizAtom,
  createHtmlRadioQuizAtom,
  createHtmlReflectAtom,
  createHtmlQuizAtom,
  createHtmlValidatedQuizAtom,
  createHtmlWorkspaceAtom,
} from './atoms';
import {
  writeHtml,
} from '.';
import { loadTemplate } from './templates';
import {
  filenamify,
  logger,
  markdownToHtml,
} from '../../utils';


/**
 * Write lesson concept content to file
 * @param {object} concept contain lesson's concept to convert to html
 * @param {string} htmlSidebar sidebar html content
 * @param {string} targetDir output directory path
 * @param {number} i the numbering of the concept for producing file prefix
 * @param {function} doneLesson callback function of lesson loop
 */
export default function writeHtmlConcepts(concept, htmlSidebar, targetDir, i, doneLesson) {
  let contentMain = '';
  // prefix for file names
  const prefix = i < 10 ? `0${i}` : i;

  async.eachSeries(concept.atoms, (atom, doneAtom) => {
    const atomTitle = markdownToHtml(atom.title);

    let promiseAtom;
    const { instructor_notes, semantic_type } = atom;
    const instructorNote = markdownToHtml(instructor_notes);

    if (semantic_type === 'ImageAtom') {
      promiseAtom = createHtmlImageAtom(atom, targetDir);
    } else if (semantic_type === 'TaskListAtom') {
      promiseAtom = createHtmlTaskListAtom(atom, targetDir, prefix);
    } else if (semantic_type === 'TextAtom') {
      promiseAtom = createHtmlTextAtom(atom, targetDir);
    } else if (semantic_type === 'VideoAtom') {
      promiseAtom = createHtmlVideoAtom(atom, targetDir, prefix);
    } else if (semantic_type === 'CheckboxQuizAtom') {
      promiseAtom = createHtmlCheckboxQuizAtom(atom);
    } else if (semantic_type === 'MatchingQuizAtom') {
      promiseAtom = createHtmlMatchingQuizAtom(atom);
    } else if (semantic_type === 'RadioQuizAtom') {
      promiseAtom = createHtmlRadioQuizAtom(atom);
    } else if (semantic_type === 'ReflectAtom') {
      promiseAtom = createHtmlReflectAtom(atom, targetDir, prefix);
    } else if (semantic_type === 'QuizAtom') {
      promiseAtom = createHtmlQuizAtom(atom, targetDir, prefix);
    } else if (semantic_type === 'ValidatedQuizAtom') {
      promiseAtom = createHtmlValidatedQuizAtom(atom);
    } else if (semantic_type === 'WorkspaceAtom') {
      promiseAtom = createHtmlWorkspaceAtom(atom);
    } else {
      const msg = 'Unknown lesson atom type. Please contact the developer to make it compatible with this atom type!';
      promiseAtom = new Promise(resolve => resolve(msg));
    }

    Promise.all([
      promiseAtom,
      loadTemplate('atom'),
    ])
      .then((res) => {
        const [htmlAtom, htmlTemplate] = res;

        const template = Handlebars.compile(htmlTemplate);
        const dataTemplate = {
          atomTitle,
          instructorNote,
          htmlAtom,
        };
        contentMain += template(dataTemplate);
        doneAtom();
      })
      .catch((err) => {
        throw err;
      });
  }, (error) => {
    if (error) throw error;

    // create HTML body content
    const title = `${prefix}. ${concept.title}`;

    // decide how many folders it needs to go up to access the assets
    const upDir = '../';
    const srcCss = `${upDir}assets/css`;
    const srcJs = `${upDir}assets/js`;
    // write html file
    const templateDataIndex = {
      contentMain,
      docTitle: concept.title,
      sidebar: htmlSidebar,
      srcCss,
      srcJs,
      title,
    };
    let file = filenamify(concept.title);
    file = `${targetDir}/${prefix}. ${file}.html`;
    writeHtml(templateDataIndex, file)
      .then(() => {
        logger.info(`Completed rendering lesson file ${file}`);
        logger.info('____________________\n');

        doneLesson();
      })
      .catch((error) => {
        throw error;
      });
  });
}
