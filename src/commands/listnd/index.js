#!/usr/bin/env node

import {
  retrieveUdacityAuthToken,
  retrieveUserInfo
} from '../functions';
import {
  logger
} from "../utils";


/**
 * Check if the authentication token is valid
 * and save it locally
 * @param {string} token Udacity authentication
 */
export default function listNanodegrees() {
  retrieveUdacityAuthToken()
    .then(token => retrieveUserInfo(token))
    .then(user => {
      const { first_name, nickname, nanodegrees, graduated_nanodegrees } = user;
      logger.info(`Hi ${nickname || first_name || 'there'}!`);
      logger.info('');

      if (!nanodegrees && !graduated_nanodegrees) {
        logger.info(`Your user profile have no Nanodegree lists`);
        return;
      }

      // show user all Nanodegrees
      if (graduated_nanodegrees && graduated_nanodegrees.length) {
        logger.info(`Here's a list of your graduated Nanodegrees (list by Nanodegree key only. The API doesn't return Nanodegree name so it can't be listed here):`);
        for (const nd of graduated_nanodegrees)  {
          logger.info(` - ${nd.key} version ${nd.version} (locale: ${nd.locale})`);
        }
        logger.info('');
      }

      if (nanodegrees && nanodegrees.length) {
        logger.info(`Here's a list of your enrolled Nanodegrees:`);
        for (const nd of nanodegrees) {
          logger.info(` - ${nd.key} version ${nd.version} (locale: ${nd.locale}): ${nd.title || 'Unnamed Nanodegree'}`);
        }
      }
    })
    .catch(error => {
      throw error;
    });
}
