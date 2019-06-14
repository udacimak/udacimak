const _filenamify = require('filenamify');


/**
 * Rename file name to be valid by removing special characters
 * @param {string} filename file name
 * @returns {string} valid file name
 */
export default function filenamify(filename, option) {
  if (!option) {
    option = {
      replacement: '',
    };
  }

  return _filenamify(filename, option);
}
