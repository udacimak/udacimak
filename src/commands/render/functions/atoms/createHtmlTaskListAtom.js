import Handlebars from 'handlebars';
import { loadTemplate } from '../templates';
import {
  downloadYoutube,
  markdownToHtml
} from '../../../utils';


/**
 * Create HTML content for TaskListAtom
 * @param {object} atom atom json
 * @param {string} targetDir path to save the assets folder for videos
 * @param {string} prefix prefix for video file name
 * @returns {string} HTML content
 */
export default function createHtmlTaskListAtom(atom, targetDir, prefix) {
  let { description, positive_feedback, video_feedback } = atom;
  description = markdownToHtml(description);
  positive_feedback = markdownToHtml(positive_feedback);

  let tasks = [];
  for (let i = 0, len = atom.tasks.length; i < len; i++) {
    const task = markdownToHtml(atom.tasks[i]);
    const id = `${atom.key}--${i}`;
    tasks.push({
      id,
      task
    });
  }

  // download feedback video if available
  let youtubeId = video_feedback ? video_feedback.youtube_id : '';
  const promiseDownloadYoutube = downloadYoutube(youtubeId, targetDir, prefix, atom.title);
  const promiseLoadTemplate = loadTemplate('atom.taskList');

  return Promise.all([promiseDownloadYoutube, promiseLoadTemplate])
    .then(res => {
      let [filenameYoutube, html] = res;
      let hasFeedback = (filenameYoutube || positive_feedback);

      const dataTemplate = {
        description,
        hasFeedback,
        tasks,
        filenameYoutube,
        positive_feedback
      };
      const template = Handlebars.compile(html);
      return template(dataTemplate);
    });
}