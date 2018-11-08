#!/usr/bin/env node
import {
  renderCourse,
} from './functions';
import {
  logger,
} from '../utils';


/**
 *
 * @param {string} path path to source JSON files of a course/nanodegree
 * @param {string} targetDir target directory to save the contents
 */
export default function render(path, targetDir) {
  renderCourse(path, targetDir)
    .catch((error) => {
      logger.error(error);
    });
}
