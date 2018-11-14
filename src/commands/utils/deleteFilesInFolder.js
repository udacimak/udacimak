import dirTree from 'directory-tree';
import fs from 'fs';


/**
 * Delete all files in a directory. Sub-directory won't be deleted.
 * If file extension is provided, it'll only delete files of that type
 * @param {string} dir directory in which all files will be deleted
 * @param {string} ext file extension to delete
 */
export default function deleteFilesInFolder(dir, ext = null) {
  const dt = dirTree(dir);

  if (!dt || !dt.children || !dt.children.length) {
    return;
  }

  for (let i = 0, len = dt.children.length; i < len; i += 1) {
    const child = dt.children[i];
    if (child.type === 'file') {
      if (ext) {
        (child.extension === `.${ext}`) && fs.unlinkSync(child.path);
      } else {
        fs.unlinkSync(child.path);
      }
    }
  } //.for
}
