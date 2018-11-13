import dirTree from 'directory-tree';


/**
 * Find the local subtitles files that are associated with given youtube video
 * @param {string} filenameYoutube Youtube file name
 * @param {string} targetDir directory of Youtube file
 * @returns {Array} subtitles
 */
export default function findVideoLocalSubtitles(filenameYoutube, targetDir) {
  const subtitles = [];

  // find all subtitle files
  const allSubtitles = dirTree(targetDir, {
    extensions: /\.(vtt|srt|sbv|sub|mpsub|lrc|cap|smi|sami|rs|ttml|dfxp)$/,
  });

  if (!allSubtitles || !allSubtitles.children) return subtitles;

  // find subtitle files of the given Youtube video filename
  for (let i = 0, len = allSubtitles.children.length; i < len; i += 1) {
    const subtitlesCurrent = allSubtitles.children[i];
    const {
      extension,
      name,
    } = subtitlesCurrent;
    if (name.includes(filenameYoutube)) {
      // get language code in file name
      const srclang = `${name.replace(extension, '').match(/[a-z]{2,3}$/i)}`;
      const _default = (srclang.toLowerCase() === 'en' || srclang.toLowerCase() === 'en-us');
      subtitles.push({
        default: _default,
        src: name,
        srclang,
      });
    }
  }

  return subtitles;
}
