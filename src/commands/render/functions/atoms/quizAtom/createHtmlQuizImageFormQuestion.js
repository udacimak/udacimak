import Handlebars from 'handlebars';
import { loadTemplate } from '../../templates';
import { createHtmlWidget } from './index';
import {
  downloadImage,
  makeDir
} from '../../../../utils';


/**
 * Create HTML for ImageFormQuestion type of QuizAtom
 * @param {object} atom atom JSON
 * @param {string} outputPath path to save the assets folder for videos
 */
export default function createHtmlQuizImageFormQuestion(atom, outputPath) {
  // create directory for image assets
  const pathImg = makeDir(outputPath, 'img');
  const { question } = atom;

  // download quiz background image
  const filenameImg = `${atom.question.evaluation_id}.gif`;
  const promiseDownloadImage = downloadImage(question.background_image, pathImg, filenameImg);
  const promiseLoadTemplate = loadTemplate('atom.quiz.imageFormQuestion');

  return Promise.all([
    promiseDownloadImage,
    promiseLoadTemplate
  ]).then(res => {
    let [filenameImg, html] = res;
    let htmlWidgets = '';
    for (const widget of question.widgets) {
      htmlWidgets += createHtmlWidget(widget);
    }

    const template = Handlebars.compile(html);
    const dataTemplate = {
      htmlWidgets,
      srcImg: `img/${filenameImg}`
    };
    return template(dataTemplate);
  });
}