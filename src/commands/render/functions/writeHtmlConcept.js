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
 * @param {number} index the numbering of the concept for producing file prefix
 * @param {function} doneLesson callback function of lesson loop
 */
export default async function writeHtmlConcept(concept, htmlSidebar, targetDir, index) {
  let contentMain = '';
  const conceptTitle = concept.title || '';
  // prefix for file names
  const prefix = index < 10 ? `0${index}` : index;

  try {
    for (let i = 0, len = concept.atoms.length; i < len; i += 1) {
      const atom = concept.atoms[i];
      const atomTitle = markdownToHtml(atom.title);

      let promiseAtom;
      const semanticType = atom.semantic_type;
      const instructorNote = markdownToHtml(atom.instructor_notes);

      if (semanticType === 'ImageAtom') {
        promiseAtom = createHtmlImageAtom(atom, targetDir);
      } else if (semanticType === 'TaskListAtom') {
        promiseAtom = createHtmlTaskListAtom(atom, targetDir, prefix);
      } else if (semanticType === 'TextAtom') {
        promiseAtom = createHtmlTextAtom(atom, targetDir);
      } else if (semanticType === 'VideoAtom') {
        promiseAtom = createHtmlVideoAtom(atom, targetDir, prefix);
      } else if (semanticType === 'CheckboxQuizAtom') {
        promiseAtom = createHtmlCheckboxQuizAtom(atom);
      } else if (semanticType === 'MatchingQuizAtom') {
        promiseAtom = createHtmlMatchingQuizAtom(atom);
      } else if (semanticType === 'RadioQuizAtom') {
        promiseAtom = createHtmlRadioQuizAtom(atom);
      } else if (semanticType === 'ReflectAtom') {
        promiseAtom = createHtmlReflectAtom(atom, targetDir, prefix);
      } else if (semanticType === 'QuizAtom') {
        promiseAtom = createHtmlQuizAtom(atom, targetDir, prefix);
      } else if (semanticType === 'ValidatedQuizAtom') {
        promiseAtom = createHtmlValidatedQuizAtom(atom);
      } else if (semanticType === 'WorkspaceAtom') {
        promiseAtom = createHtmlWorkspaceAtom(atom);
      } else {
        const msg = 'Unknown lesson atom type. Please contact the developer to make it compatible with this atom type!';
        promiseAtom = new Promise(resolve => resolve(msg));
      }

      const [htmlAtom, htmlTemplate] = await Promise.all([
        promiseAtom,
        loadTemplate('atom'),
      ]);

      const template = Handlebars.compile(htmlTemplate);
      const dataTemplate = {
        atomTitle,
        instructorNote,
        htmlAtom,
      };
      contentMain += template(dataTemplate);
    }

    // create HTML body content
    const title = `${prefix}. ${conceptTitle}`;

    // decide how many folders it needs to go up to access the assets
    const upDir = '../';
    const srcCss = `${upDir}assets/css`;
    const srcJs = `${upDir}assets/js`;
    // write html file
    const templateDataIndex = {
      contentMain,
      docTitle: conceptTitle,
      sidebar: htmlSidebar,
      srcCss,
      srcJs,
      title,
    };
    let file = filenamify(conceptTitle);
    file = `${targetDir}/${prefix}. ${file}.html`;

    await writeHtml(templateDataIndex, file);
    logger.info(`Completed rendering lesson file ${file}`);
    logger.info('____________________\n');
  } catch (error) {
    throw error;
  }
}
