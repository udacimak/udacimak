import Handlebars from 'handlebars';
import path from 'path';
import {
  downloadImage,
  makeDir,
  markdownToHtml,
} from '../../../utils';
import { loadTemplate } from '../templates';


/**
 * Create HTML content for ImageAtom
 * @param {object} atom atom json
 * @param {string} outputPath path to save the assets folder for images
 * @returns {string} HTML content
 */
export default async function createHtmlImageAtom(atom, outputPath) {
  let { caption } = atom;
  const { url } = atom;

  // create directory for image assets
  const pathImg = makeDir(outputPath, 'img');

  // if link doesn't contain image extension, create a custom file name
  let filename;
  if (!path.extname(url)) {
    filename = `${atom.id}.gif`;
  }

  // download image first and save it
  const promiseDownload = downloadImage(url, pathImg, filename);
  const promiseLoadTemplate = loadTemplate('atom.image');

  const [filenameImg, html] = await Promise.all([promiseDownload, promiseLoadTemplate]);
  const alt = caption;
  caption = markdownToHtml(caption);

  const dataTemplate = {
    file: `img/${filenameImg}`,
    alt,
    caption,
  };
  const template = Handlebars.compile(html);

  return template(dataTemplate);
}
