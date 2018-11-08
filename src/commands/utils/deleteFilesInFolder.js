import dirTree from 'directory-tree';
import fs from 'fs';


/**
 * Delete all files in a directory. Sub-directory won't be deleted.
 * If file extension is provided, it'll only delete files of that type
 * @param {string} dir directory in which all files will be deleted
 * @param {string} ext file extension to delete
 */
export default function deleteFilesInFolder(dir, ext = null) {
  const _dirTree = dirTree(dir);

  for (const child of _dirTree.children) {
    if (child.type === 'file') {
      if (ext) {
        (child.extension == `.${ext}`) && fs.unlinkSync(child.path);
      } else {
        fs.unlinkSync(child.path);
      }
    }
  } //.for
}
