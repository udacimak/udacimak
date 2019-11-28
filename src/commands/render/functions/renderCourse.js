#!/usr/bin/env node
import fs from 'fs-extra';
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
 * @param {string} path path to source JSON files of a course/nanodegree
 * @param {string} targetDir target directory to save the contents
 */
export default async function renderCourse(path, targetDir) {
  if (path === targetDir) {
    throw new Error('Target directory must not be the same with source directory. Please change the target directory.');
  }

  try {
    await fs.access(targetDir, fs.constants.F_OK);
  } catch (error) {
    throw new Error(`Target directory doesn't exist. Please create the directory "${targetDir}"`);
  }

  let courseType;
  const sourceDirTree = dirTree(path);
  if (!sourceDirTree) {
    throw new Error('Path to downloaded Udacity course/Nanodegree doesn\'t exist.');
  }

  const nanodegreeName = sourceDirTree.name;

  if (filenamify(path) === filenamify(`${targetDir}/${nanodegreeName}`)) {
    throw new Error('Please choose another target directory to avoid rendering contents into the same folder that contains downloaded JSON data from Udacity.');
  }

  // flag to determine if this folder contains downloaded course JSON from Udacity
  let isCourseFolder = false;
  for (let i = 0, len = sourceDirTree.children.length; i < len; i += 1) {
    const child = sourceDirTree.children[i];
    if (child.name === 'data.json') {
      // check if this is a nanodegree, free course or what
      courseType = getCourseType(path);
      isCourseFolder = true;
      break;
    }
  }

  if (!isCourseFolder) {
    logger.info(`${path} doesn't contain 'data.json' to start rendering the contents. Are you sure this folder contains downloaded course JSON from Udacity?`);
    return;
  }
  // create the root folder for the course
  const dirNanodegree = makeRootDir(targetDir, nanodegreeName);

  // create Nanodegree summary home page
  let promiseCourseSummary;
  if (courseType === 'NANODEGREE') {
    promiseCourseSummary = writeHTMLNanodegreeSummary(path, dirNanodegree, nanodegreeName);
  } else {
    promiseCourseSummary = writeHtmlCourseSummary(path, dirNanodegree, nanodegreeName);
  }

  await promiseCourseSummary;

  // loop Part folders
  for (let i = 0, len = sourceDirTree.children.length; i < len; i += 1) {
    const treePart = sourceDirTree.children[i];
    if (courseType === 'COURSE') {
      // this is a course, so create Lessons now
      if (treePart.type === 'directory' && !treePart.path.includes("/assets") && !treePart.path.includes("\assets")) {
        const pathSourceJSON = treePart.path;
        const pathLesson = makeDir(dirNanodegree, treePart.name);
        await writeHtmlLesson(pathSourceJSON, pathLesson);
      }
    } else if (courseType === 'NANODEGREE') {
      // this is a nanodegree
      if (treePart.type === 'directory' && !treePart.path.includes("/assets") && !treePart.path.includes("\assets")) {
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

                const pathSourceJSON = `${path}/${treePart.name}/${treeModule.name}/${treeLesson.name}`;
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
