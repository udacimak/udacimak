import cheerio from 'cheerio';
import path from 'path';
import {
  downloadImage,
  makeDir,
} from '.';


/**
 * Find media links in given HTML text and download them
 * @param {string} html text in HTML format
 * @param {string} targetDir target directory
 * @param {string} atomId id of atom or label
 */
export default async function downloadMediaInHtml(html, targetDir, atomId) {
  if (!html) return html;

  // find if there are videos / images need to be downloaded
  const $ = cheerio.load(html);
  const videos = $('video source');
  const images = $('img');

  // save links to download video / images
  const links = [];
  // create directory for video / image assets

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

  if (!links.length) return html;

  const pathMedia = makeDir(targetDir, 'media');

  try {
    // loop and download all media links
    for (let j = 0, len = links.length; j < len; j += 1) {
      const link = links[j];
      const { i, type, src } = link;

      // since these src values may contain a link, but won't return a proper filename
      // manually create the file name
      let extension = null;

      src && path.extname(src);

      let filename;
      if (!extension) {
        // provide extension if it's not in the url
        extension = (type === 'video') ? '.mp4' : '.gif';
        // generate file name with atom id and i (index of links array)
        filename = `unnamed-${atomId}-${i}${extension}`;
      }

      const filenameImg = await downloadImage(src, pathMedia, filename);
      html = html.replace(src, `media/${filenameImg}`);
    } //.for links

    return html;
  } catch (error) {
    throw error;
  }
}
