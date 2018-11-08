import fs from 'fs';
import { promptOverwriteDir } from '.';


/**
 * Check if a folder to download course/Nanodegree has already exist
 * and prompt user if they want to overwrite this folder
 * @param {string} targetDir target directory
 * @param {string} dirName directory name of course/Nanodegree
 */
export default function checkOverwriteDir(targetDir, dirName) {
  const path = `${targetDir}/${dirName}`;

  if (fs.existsSync(path)) {
    // prompt user if they want to overwrite this folder
    return promptOverwriteDir(dirName);
  }
  return new Promise(resolve => resolve(true));
}
