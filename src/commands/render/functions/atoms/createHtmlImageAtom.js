/* eslint-disable camelcase */
import Handlebars from 'handlebars';
import validUrl from 'valid-url';
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
  const { url, non_google_url } = atom;
  let imageUrl = null;
  const isUrlvalid = validUrl.isUri(url);
  const isNonGoogleUrlValid = validUrl.isUri(non_google_url);
  if (isUrlvalid) {
    imageUrl = url;
  } else if (isNonGoogleUrlValid) {
    imageUrl = non_google_url;
  }

  // create directory for image assets
  const pathImg = makeDir(outputPath, 'img');

  // if link doesn't contain image extension, create a custom file name
  let filename;
  if (!path.extname(url)) {
    filename = `${atom.id}.gif`;
  }

  // download image first and save it
  const promiseDownload = imageUrl !== null ? downloadImage(imageUrl, pathImg, filename) : null;
  const promiseLoadTemplate = loadTemplate('atom.image');

  const [filenameImg, html] = await Promise.all([promiseDownload, promiseLoadTemplate]);
  const alt = caption;
  caption = markdownToHtml(caption);

  let file = '';
  if (filenameImg === null) {
    if (isUrlvalid) {
      file = url;
    } else if (isNonGoogleUrlValid) {
      file = non_google_url;
    }
  } else {
    file = `img/${filenameImg}`;
  }

  const dataTemplate = {
    file,
    alt,
    caption,
  };
  const template = Handlebars.compile(html);

  return template(dataTemplate);
}
