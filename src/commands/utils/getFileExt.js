/**
 * Extract file extension from file name
 * @param {string} file file name
 */
export default function getFileExt(filename) {
  // wrap in string literal to get string out of string.match()
  return `${filename.match(/\.[^\.]+\.[^\.]+$/i)}`;
}
