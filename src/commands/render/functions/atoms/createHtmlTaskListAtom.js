import Handlebars from 'handlebars';
import { loadTemplate } from '../templates';
import {
  downloadYoutube,
  markdownToHtml,
} from '../../../utils';
import { createHtmlText } from '../utils';

/**
 * Create HTML content for TaskListAtom
 * @param {object} atom atom json
 * @param {string} targetDir path to save the assets folder for videos
 * @param {string} prefix prefix for video file name
 * @returns {string} HTML content
 */
export default async function createHtmlTaskListAtom(atom, targetDir, prefix) {
  let { description } = atom;
  let positiveFeedback = atom.positive_feedback;
  description = await createHtmlText(description, targetDir);
  positiveFeedback = await createHtmlText(positiveFeedback, targetDir);

  const tasks = [];
  for (let i = 0, len = atom.tasks.length; i < len; i += 1) {
    const task = markdownToHtml(atom.tasks[i]);
    const id = `${atom.key}--${i}`;
    tasks.push({
      id,
      task,
    });
  }

  // download feedback video if available
  const youtubeId = atom.video_feedback ? atom.video_feedback.youtube_id : '';
  const promiseDownloadYoutube = downloadYoutube(youtubeId, targetDir, prefix, atom.title);
  const promiseLoadTemplate = loadTemplate('atom.taskList');

  const [filenameYoutube, html] = await Promise.all([promiseDownloadYoutube, promiseLoadTemplate]);
  const hasFeedback = (filenameYoutube || positiveFeedback);

  const dataTemplate = {
    description,
    hasFeedback,
    tasks,
    filenameYoutube,
    positiveFeedback,
  };
  const template = Handlebars.compile(html);
  return template(dataTemplate);
}
