import Handlebars from 'handlebars';
import { loadTemplate } from '../templates';
import {
  downloadYoutube,
  markdownToHtml,
} from '../../../utils';
import { createHtmlText } from '../utils';


/**
 * Create HTML content for ReflectAtom
 * @param {object} atom atom json
 * @param {string} targetDir path to save the assets folder for videos
 * @param {string} prefix prefix for video file name
 * @returns {string} HTML content
 */
export default async function createHtmlReflectAtom(atom, targetDir, prefix) {
  const questionTitle = markdownToHtml(atom.question.title);
  let questionText;

  if (atom.question.semantic_type === 'TextQuestion') {
    questionText = await createHtmlText(atom.question.text, targetDir);
  } else {
    questionText = '<p>Unknown question type. Please contact the developer to make it compatible with this atom type!</p>';
  }

  // download answer video if available
  const youtubeId = atom.answer.video ? atom.answer.video.youtube_id : '';
  const promiseDownloadYoutube = downloadYoutube(youtubeId, targetDir, prefix, atom.title);
  const promiseLoadTemplate = loadTemplate('atom.reflect');

  const [filenameYoutube, html] = await Promise.all([promiseDownloadYoutube, promiseLoadTemplate]);

  const answer = await createHtmlText(atom.answer.text, targetDir);
  const dataTemplate = {
    answer,
    filenameYoutube,
    questionTitle,
    questionText,
  };
  const template = Handlebars.compile(html);
  return template(dataTemplate);
}
