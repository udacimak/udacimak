import Handlebars from 'handlebars';
import { loadTemplate } from '../templates';
import {
  createHtmlQuizImageFormQuestion,
  createHtmlQuizProgrammingQuestion,
} from './quizAtom';
import {
  downloadYoutube,
} from '../../../utils';
import { createHtmlText } from '../utils';


/**
 * Create HTML content for QuizAtom
 * @param {object} atom atom json
 * @param {string} targetDir path to save the assets folder for videos
 * @param {string} prefix prefix for file name
 * @returns {string} HTML content
 */
export default async function createHtmlQuizAtom(atom, targetDir, prefix) {
  try {
    const { question } = atom;
    const semanticType = question.semantic_type;
    let promiseQuizQuestion;

    // download instruction video if available
    const youtubeIdQuestion = (atom.instruction && atom.instruction.video)
      ? atom.instruction.video.youtube_id : '';
    const filenameYoutubeQuestion = await downloadYoutube(youtubeIdQuestion,
      targetDir, prefix, atom.title);

    // process different semantic types of QuizAtom
    if (semanticType === 'ProgrammingQuestion' || semanticType === 'IFrameQuestion') {
      promiseQuizQuestion = createHtmlQuizProgrammingQuestion(atom);
    } else if (semanticType === 'ImageFormQuestion') {
      promiseQuizQuestion = createHtmlQuizImageFormQuestion(atom, targetDir, prefix);
    } else {
      const msg = 'Unknown quiz type. Please contact the developer to make it compatible with this atom type!';
      promiseQuizQuestion = new Promise(resolve => resolve(msg));
    }

    const htmlQuiz = await promiseQuizQuestion;

    // all other promises
    const youtubeIdAnswer = (atom.answer && atom.answer.video)
      ? atom.answer.video.youtube_id : '';
    const promiseDownloadYoutubeAnswer = downloadYoutube(youtubeIdAnswer,
      targetDir, prefix, atom.title);
    const promiseLoadTemplate = loadTemplate('atom.quiz');

    const [
      filenameYoutubeAnswer,
      html,
    ] = await Promise.all([
      promiseDownloadYoutubeAnswer,
      promiseLoadTemplate,
    ]);

    const instruction = atom.instruction
      ? await createHtmlText(atom.instruction.text, targetDir) : '';
    const answerText = atom.answer
      ? await createHtmlText(atom.answer.text, targetDir) : '';
    const hasSolution = filenameYoutubeAnswer || answerText;
    const hasInstruction = filenameYoutubeQuestion || instruction;

    const dataTemplate = {
      answerText,
      instruction,
      filenameYoutubeQuestion,
      filenameYoutubeAnswer,
      hasSolution,
      hasInstruction,
      htmlQuiz,
    };
    const template = Handlebars.compile(html);
    return template(dataTemplate);
  } catch (error) {
    throw error;
  }
}
