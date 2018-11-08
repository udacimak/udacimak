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
  downloadYoutube,
  filenamify,
  logger,
} from '../../utils';


/**
 * Write HTML file for lab
 * @param {object} lab JSON data for lab
 * @param {string} htmlSidebar sidebar html content
 * @param {string} targetDir target directory
 */
export default function writeHtmlLab(lab, htmlSidebar, targetDir) {
  if (!lab) {
    return;
  }

  const {
    details,
    title,
    overview,
    review_video,
    workspace,
  } = lab;
  const file = path.join(targetDir, filenamify(`Lab - ${title}.html`));

  let reviewVideo;
  if (review_video && review_video.youtube_id) {
    reviewVideo = downloadYoutube(review_video.youtube_id, targetDir, 'Lab - ', title);
  }

  const instructions = createHtmlLabInstructions(details, targetDir);
  const introduction = createHtmlLabIntroduction(overview, title, targetDir);
  const htmlWorkspace = createHtmlWorkspaceAtom(workspace);
  const templateLab = loadTemplate('lab');

  return Promise.all([
    instructions,
    introduction,
    htmlWorkspace,
    reviewVideo,
    templateLab,
  ]).then((data) => {
    const [instructions, introduction, htmlWorkspace, filenameYoutube, html] = data;

    const htmlReviewVideo = `
      <video controls>
        <source src="${filenameYoutube}" type="video/mp4">
      </video>
    `;
    const dataLab = {
      introduction,
      instructions,
      htmlReviewVideo,
      reflection: '(Reflection is only available online on Udacity website)',
      workspace: htmlWorkspace,
    };
    const template = Handlebars.compile(html);
    const htmlLab = template(dataLab);

    // decide how many folders it needs to go up to access the assets
    const upDir = '../';
    const srcCss = `${upDir}assets/css`;
    const srcJs = `${upDir}assets/js`;
    // write html file
    const templateDataIndex = {
      docTitle: title,
      sidebar: htmlSidebar,
      srcCss,
      srcJs,
      title: `Lab: ${title}`,
      contentMain: htmlLab,
    };

    return templateDataIndex;
  }).then(templateDataIndex => writeHtml(templateDataIndex, file))
    .then(() => {
      logger.info(`Completed rendering lab file ${file}`);
      logger.info('____________________\n');
    })
    .catch((error) => {
      throw error;
    });
}
