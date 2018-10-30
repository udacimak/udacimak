
import {
  config,
  logger
} from '../utils';
import {
  fetchUdacityUserInfo
} from '../../api';
import {
  CLI_CONFIG_UDACITY_AUTH_TOKEN
} from '../../config';


/**
 * Validate a token by sending request to Udacity API and save it
 * if it is valid
 * @param {string} token Udacity authentication token
 */
export default function validateSaveUdacityAuthToken(token) {
  return fetchUdacityUserInfo(token)
    .then(res => {
      if (!res.data || !res.data.user) {
        logger.error(`Could not validate your Udacity token. Please try again. Here's the error message:
        ${res.body}`);
        return;
      }
      // save token
      config.set(CLI_CONFIG_UDACITY_AUTH_TOKEN, token);

      const { user } = res.data;
      const { first_name, nickname } = user;
      const name = nickname || first_name;
      const msgSuccess = `You have successfully saved authentication token locally!`;
      if (name) {
        logger.info(`Hi ${name}. ${msgSuccess}`);
      } else {
        logger.info(`${msgSuccess}`);
      }

      return token;
    })
    .catch(error => {
      logger.error(`Failed to validate your Udacity token. Please try again. Here's the error message:
      ${JSON.stringify(error, null, 4)}`);
    });
}