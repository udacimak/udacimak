import Handlebars from 'handlebars';
import { loadTemplate } from '../templates';
import {
  createHtmlQuizImageFormQuestion,
  createHtmlQuizProgrammingQuestion
} from './quizAtom';
import {
  downloadYoutube,
  markdownToHtml
} from '../../../utils';


/**
 * Create HTML content for QuizAtom
 * @param {object} atom atom json
 * @param {string} targetDir path to save the assets folder for videos
 * @param {string} prefix prefix for file name
 * @returns {string} HTML content
 */
export default function createHtmlQuizAtom(atom, targetDir, prefix) {
  const { question } = atom;
  const { semantic_type } = question;
  let promiseQuizQuestion;

  // process different semantic types of QuizAtom
  if (semantic_type === 'ProgrammingQuestion') {
    promiseQuizQuestion = createHtmlQuizProgrammingQuestion(atom);
  } else if (semantic_type === 'ImageFormQuestion') {
    promiseQuizQuestion = createHtmlQuizImageFormQuestion(atom, targetDir, prefix);
  } else {
    const msg = 'Unknown quiz type. Please contact the developer to make it compatible with this atom type!';
    promiseQuizQuestion = new Promise(resolve => resolve(msg));
  }

  // download instruction video if available
  const youtubeIdQuestion = (atom.instruction && atom.instruction.video) ? atom.instruction.video.youtube_id : '';
  const youtubeIdAnswer = (atom.answer && atom.answer.video) ? atom.answer.video.youtube_id : '';
  const promiseDownloadYoutubeQuestion = downloadYoutube(youtubeIdQuestion, targetDir, prefix, atom.title);
  const promiseDownloadYoutubeAnswer = downloadYoutube(youtubeIdAnswer, targetDir, prefix, atom.title);
  const promiseLoadTemplate = loadTemplate('atom.quiz');

  return Promise.all([
    promiseDownloadYoutubeAnswer,
    promiseDownloadYoutubeQuestion,
    promiseLoadTemplate,
    promiseQuizQuestion
  ]).then(res => {
    let [filenameYoutubeQuestion, filenameYoutubeAnswer, html, htmlQuiz] = res;

    const instruction = atom.instruction ? markdownToHtml(atom.instruction.text) : '';
    const answerText = atom.answer ? markdownToHtml(atom.answer.text) : '';
    const hasSolution = filenameYoutubeAnswer || answerText;
    const hasInstruction = filenameYoutubeQuestion || instruction;

    const dataTemplate = {
      answerText,
      instruction,
      hasSolution,
      hasInstruction,
      htmlQuiz
    };
    const template = Handlebars.compile(html);
    return template(dataTemplate);
  });
}