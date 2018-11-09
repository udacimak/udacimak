#!/usr/bin/env node
import process from 'process';
import {
  retrieveUdacityAuthToken,
  retrieveUserInfo,
} from '../functions';
import {
  logger,
} from '../utils';


/**
 * Check if the authentication token is valid
 * and save it locally
 * @param {string} token Udacity authentication
 */
export default async function listNanodegrees() {
  try {
    const token = await retrieveUdacityAuthToken();
    const user = await retrieveUserInfo(token);

    const {
      nickname, nanodegrees,
    } = user;
    const graduatedNanodegrees = user.graduated_nanodegrees;
    logger.info(`Hi ${nickname || user.first_name || 'there'}!`);
    logger.info('');

    if (!nanodegrees && !graduatedNanodegrees) {
      logger.info('Your user profile have no Nanodegree lists');
      return;
    }

    // show user all Nanodegrees
    if (graduatedNanodegrees && graduatedNanodegrees.length) {
      logger.info('Here\'s a list of your graduated Nanodegrees (list by Nanodegree key only. The API doesn\'t return Nanodegree name so it can\'t be listed here):');
      for (let i = 0, len = graduatedNanodegrees.length; i < len; i += 1) {
        const nd = graduatedNanodegrees[i];
        logger.info(` - ${nd.key} version ${nd.version} (locale: ${nd.locale})`);
      }
      logger.info('');
    }

    if (nanodegrees && nanodegrees.length) {
      logger.info('Here\'s a list of your enrolled Nanodegrees:');
      for (let i = 0, len = nanodegrees.length; i < len; i += 1) {
        const nd = nanodegrees[i];
        logger.info(` - ${nd.key} version ${nd.version} (locale: ${nd.locale}): ${nd.title || 'Unnamed Nanodegree'}`);
      }
    }
  } catch (error) {
    logger.error(`Failed to get Nanodegree list with error:
${JSON.stringify(error, null, 4)}`);
    process.exit(1);
  }
}
