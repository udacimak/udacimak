import Handlebars from 'handlebars';
import {
  downloadImage,
  getFileExt,
  makeDir,
  markdownToHtml
} from '../../../utils';
import { loadTemplate } from '../templates';


/**
 * Create HTML content for ImageAtom
 * @param {object} atom atom json
 * @param {string} outputPath path to save the assets folder for images
 * @returns {string} HTML content
 */
export default function createHtmlImageAtom(atom, outputPath) {
  let { caption } = atom;
  // create directory for image assets
  const pathImg = makeDir(outputPath, 'img');

  // if link doesn't contain image extension, create a custom file name
  let filename;
  if (!getFileExt(atom.url)) {
    filename = `${atom.id}.gif`;
  }

  // download image first and save it
  const promiseDownload = downloadImage(atom.url, pathImg, filename);
  const promiseLoadTemplate = loadTemplate('atom.image');

  return Promise.all([promiseDownload, promiseLoadTemplate])
    .then(data => {
      const [filenameImg, html] = data;
      const alt = caption;
      caption = markdownToHtml(caption);
      const dataTemplate = {
        file: `img/${filenameImg}`,
        alt: caption,
        caption,
      };
      const template = Handlebars.compile(html);

      return template(dataTemplate);
    });
}