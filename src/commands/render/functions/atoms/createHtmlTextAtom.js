import Handlebars from 'handlebars';
import {
  downloadImage,
  getFileExt,
  makeDir,
  markdownToHtml,
} from '../../../utils';
import { loadTemplate } from '../templates';

const async = require('async');
const cheerio = require('cheerio');


/**
 * Create HTML content for TextAtom
 * @param {object} atom atom json
 * @param {string} outputPath path to save the assets
 * @returns {string} HTML content
 */
export default function createHtmlTextAtom(atom, outputPath) {
  return new Promise((resolve, reject) => {
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

    // loop and download all media links
    async.eachSeries(links, (link, done) => {
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

      downloadImage(src, pathMedia, filename)
        .then((filenameImg) => {
          text = text.replace(src, `media/${filenameImg}`);
          done();
        })
        .catch((error) => {
          reject(error);
        });
    }, (error) => {
      if (error) reject(error);

      loadTemplate('atom.text')
        .then((html) => {
          const data = {
            text,
          };

          const template = Handlebars.compile(html);
          const htmlResult = template(data);

          resolve(htmlResult);
        });
    });
  });
}
