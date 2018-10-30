/**
 * Extract file extension from file name
 * @param {string} file file name
 */
export default function getFileExt(filename) {
  return filename.match(/\..+\.[0-9a-z]{3,}$/i);
}