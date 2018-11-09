#!/usr/bin/env node
import {
  renderCourse,
} from './functions';
import {
  getFullErrorMessage,
  logger,
} from '../utils';


/**
 *
 * @param {string} path path to source JSON files of a course/nanodegree
 * @param {string} targetDir target directory to save the contents
 */
export default async function render(path, targetDir) {
  try {
    await renderCourse(path, targetDir);
  } catch (error) {
    logger.error(getFullErrorMessage(error));
  }
}
