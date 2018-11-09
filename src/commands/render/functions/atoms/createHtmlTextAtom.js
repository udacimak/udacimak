import cheerio from 'cheerio';
import Handlebars from 'handlebars';
import {
  downloadImage,
  getFileExt,
  makeDir,
  markdownToHtml,
} from '../../../utils';
import { loadTemplate } from '../templates';


/**
 * Create HTML content for TextAtom
 * @param {object} atom atom json
 * @param {string} outputPath path to save the assets
 * @returns {string} HTML content
 */
export default async function createHtmlTextAtom(atom, outputPath) {
  let text = markdownToHtml(atom.text);

  // find if there are videos / images need to be downloaded
  const $ = cheerio.load(text);
  const videos = $('video source');
  const images = $('img');

  // save links to download video / images
  const links = [];
  // create directory for video / image assets
  const pathMedia = makeDir(outputPath, 'media');

  if (videos && videos.length) {
    videos.each((i, video) => {
      links.push({
        i,
        type: 'video',
        src: video.attribs.src,
      });
    });
  }

  if (images && images.length) {
    images.each((i, image) => {
      links.push({
        i,
        type: 'img',
        src: image.attribs.src,
      });
    });
  }

  try {
    // loop and download all media links
    for (let j = 0, len = links.length; j < len; j += 1) {
      const link = links[j];
      const { i, type, src } = link;

      // since these src values may contain a link, but won't return a proper filename
      // manually create the file name
      let extension = getFileExt(src);
      let filename;
      if (!extension) {
        // provide extension if it's not in the url
        extension = (type === 'video') ? '.mp4' : '.gif';
        // generate file name with atom id and i (index of links array)
        filename = `unnamed-${atom.id}-${i}${extension}`;
      }

      const filenameImg = await downloadImage(src, pathMedia, filename);
      text = text.replace(src, `media/${filenameImg}`);
    } //.for links

    const html = await loadTemplate('atom.text');
    const data = {
      text,
    };
    const template = Handlebars.compile(html);
    return template(data);
  } catch (error) {
    throw error;
  }
}
