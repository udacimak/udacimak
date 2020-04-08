#!/usr/bin/env node
import fs from 'fs-extra';
import path from 'path';
import {
  writeHtmlCourseSummary,
  writeHtmlLesson,
  writeHTMLNanodegreeSummary,
} from '.';
import {
  logger,
  makeDir,
  filenamify,
} from '../../utils';
import {
  getCourseType,
  makeRootDir,
} from './utils';

const dirTree = require('directory-tree');


/**
 * Render a whole course/Nanodegree by creating HTML files, downloading resources
 * (videos, images)
 * @param {string} sourceDir path to source JSON files of a course/nanodegree
 * @param {string} targetDir target directory to save the contents
 */
export default async function renderCourse(sourceDir, targetDir) {
  if (sourceDir === targetDir) {
    logger.error('Target directory must not be the same with source directory. Please change the target directory.');
    return;
  }

  try {
    await fs.access(targetDir, fs.constants.F_OK);
  } catch (error) {
    logger.error(`Target directory doesn't exist. Please create the directory "${targetDir}"`);
    return;
  }

  let courseType;
  const sourceDirTree = dirTree(sourceDir);
  if (!sourceDirTree) {
    logger.error('Path to downloaded Udacity course/Nanodegree doesn\'t exist.');
    return;
  }

  const nanodegreeName = sourceDirTree.name;

  const isTargetSameAsSource = fs.existsSync(path.join(process.cwd(), targetDir, 'data.json'));

  if (isTargetSameAsSource || (filenamify(sourceDir) === filenamify(`${targetDir}/${nanodegreeName}`))) {
    logger.error('Please choose another target directory to avoid rendering contents into the same folder that contains downloaded JSON data from Udacity.');
    return;
  }

  // flag to determine if this folder contains downloaded course JSON from Udacity
  let isCourseFolder = false;
  for (let i = 0, len = sourceDirTree.children.length; i < len; i += 1) {
    const child = sourceDirTree.children[i];
    if (child.name === 'data.json') {
      // check if this is a nanodegree, free course or what
      courseType = getCourseType(sourceDir);
      isCourseFolder = true;
      break;
    }
  }

  if (!isCourseFolder) {
    logger.info(`${sourceDir} doesn't contain 'data.json' to start rendering the contents. Are you sure this folder contains downloaded course JSON from Udacity?`);
    return;
  }
  // create the root folder for the course
  const dirNanodegree = makeRootDir(targetDir, nanodegreeName);

  // create Nanodegree summary home page
  let promiseCourseSummary;
  if (courseType === 'NANODEGREE') {
    promiseCourseSummary = writeHTMLNanodegreeSummary(sourceDir, dirNanodegree, nanodegreeName);
  } else {
    promiseCourseSummary = writeHtmlCourseSummary(sourceDir, dirNanodegree, nanodegreeName);
  }

  await promiseCourseSummary;

  // loop Part folders
  for (let i = 0, len = sourceDirTree.children.length; i < len; i += 1) {
    const treePart = sourceDirTree.children[i];
    if (courseType === 'COURSE') {
      // this is a course, so create Lessons now
      if (treePart.type === 'directory') {
        const pathSourceJSON = treePart.path;
        const pathLesson = makeDir(dirNanodegree, treePart.name);
        await writeHtmlLesson(pathSourceJSON, pathLesson);
      }
    } else if (courseType === 'NANODEGREE') {
      // this is a nanodegree
      if (treePart.type === 'directory') {
        // retrieve part number
        const prefixPart = treePart.name.match(/Part [\d]+/i);

        for (let j = 0, lenModules = treePart.children.length; j < lenModules; j += 1) {
          const treeModule = treePart.children[j];

          // loop through "Module" folders
          if (treeModule.type === 'directory') {
            // retrieve module number
            const prefixModule = treeModule.name.match(/Module [\d]+/i);


            for (let k = 0, lenLessons = treeModule.children.length; k < lenLessons; k += 1) {
              const treeLesson = treeModule.children[k];

              // loop through "Lesson" folders
              if (treeLesson.type === 'directory') {
                const dirNameLesson = `${prefixPart}-${prefixModule}-${treeLesson.name}`;
                const pathLesson = makeDir(dirNanodegree, dirNameLesson);

                const pathSourceJSON = `${sourceDir}/${treePart.name}/${treeModule.name}/${treeLesson.name}`;
                await writeHtmlLesson(pathSourceJSON, pathLesson);
              } //.if treeLesson.type
            } //.for lessons
          } //.if treeModule.type
        } //.for modules
      } //. if treePart.type
    } //.if courseType
  }

  logger.info(`Completed parsing and creating local content for ${nanodegreeName}`);
}
