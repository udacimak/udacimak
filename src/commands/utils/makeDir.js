import fs from 'fs';
import _path from 'path';


/**
 * Create directory or use existing one
 * @param {string} path directory path to create new directory
 * @param {string} dirname new directory name
 * @returns {string} full new directory path
 */
export default function makeDir(path, dirname) {
  const fullPath = _path.join(path.trim(), dirname.trim());

  try {
    fs.existsSync(fullPath) || fs.mkdirSync(fullPath);
  } catch (err) {
    throw err;
  }

  return fullPath;
}
