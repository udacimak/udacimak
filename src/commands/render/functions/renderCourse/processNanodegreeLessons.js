import { writeHtmlLesson } from '..';
import { makeDir } from '../../../utils';


export default async function processNanodegreeLessons(treeLessons,
  prefix, dirNanodegree, pathSourceJSON) {
  for (let i = 0, len = treeLessons.length; i < len; i += 1) {
    const treeLesson = treeLessons[i];

    if (treeLesson.type === 'directory') {
      const dirNameLesson = `${prefix}-${treeLesson.name}`;
      const pathLesson = makeDir(dirNanodegree, dirNameLesson);

      const pathSourceJSON = `${path}/${treePart.name}/${treeModule.name}/${treeLesson.name}`;
      writeHtmlLesson(pathSourceJSON, pathLesson);
    }
  }
}
