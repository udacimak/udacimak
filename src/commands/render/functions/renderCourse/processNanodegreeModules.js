import { processNanodegreeLessons } from '';


export default async function processNanodegreeModules(treeModules, prefixPart) {
  for (let i = 0, len = treeModules.length; i < len; i += 1) {
    const treeModule = treeModules[i];

    if (treeModule.type === 'directory') {
      // retrieve module number
      const prefixModule = treeModule.name.match(/Module [\d]+/i);

      await processNanodegreeLessons(treeModule, `${prefixPart}-${prefixModule}`);
    }
  } //.for modules
}
