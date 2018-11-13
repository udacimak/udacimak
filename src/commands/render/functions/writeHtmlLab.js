import Handlebars from 'handlebars';
import path from 'path';
import {
  createHtmlWorkspaceAtom,
} from './atoms';
import {
  createHtmlLabInstructions,
  createHtmlLabIntroduction,
} from './lab';
import {
  writeHtml,
} from '.';
import {
  loadTemplate,
} from './templates';
import {
  filenamify,
  logger,
} from '../../utils';
import { createHtmlVideo } from './utils';


/**
 * Write HTML file for lab
 * @param {object} lab JSON data for lab
 * @param {string} htmlSidebar sidebar html content
 * @param {string} targetDir target directory
 */
export default async function writeHtmlLab(lab, htmlSidebar, targetDir) {
  if (!lab) {
    return;
  }

  const {
    details,
    title,
    overview,
    workspace,
  } = lab;
  const file = path.join(targetDir, filenamify(`Lab - ${title}.html`));

  let promiseHtmlReviewVideo;
  if (lab.review_video && lab.review_video.youtube_id) {
    promiseHtmlReviewVideo = createHtmlVideo(lab.review_video.youtube_id, targetDir, 'Lab - ', title);
  }

  const promiseInstructions = createHtmlLabInstructions(details, targetDir);
  const promiseIntroduction = createHtmlLabIntroduction(overview, title, targetDir);
  const promiseHtmlWorkspace = createHtmlWorkspaceAtom(workspace);
  const templateLab = loadTemplate('lab');

  const [
    instructions,
    introduction,
    htmlWorkspace,
    reviewVideo,
    html,
  ] = await Promise.all([
    promiseInstructions,
    promiseIntroduction,
    promiseHtmlWorkspace,
    promiseHtmlReviewVideo,
    templateLab,
  ]);
  const dataLab = {
    introduction,
    instructions,
    reviewVideo,
    reflection: '(Reflection is only available online on Udacity website)',
    workspace: htmlWorkspace,
  };
  const template = Handlebars.compile(html);
  const htmlLab = template(dataLab);

  // decide how many folders it needs to go up to access the assets
  const pathToAssets = '../';
  // write html file
  const templateDataIndex = {
    docTitle: title,
    sidebar: htmlSidebar,
    pathToAssets,
    title: `Lab: ${title}`,
    contentMain: htmlLab,
  };

  await writeHtml(templateDataIndex, file);
  logger.info(`Completed rendering lab file ${file}`);
  logger.info('____________________\n');
}
