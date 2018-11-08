import {
  promptInputUdacityAuthToken,
  validateSaveUdacityAuthToken,
} from '.';
import {
  CLI_CONFIG_UDACITY_AUTH_TOKEN,
} from '../../config';
import {
  config,
  logger,
} from '../utils';


/**
 * Try to retrieve Udacity authentication token from local settings.
 * If it hasn't been provided, prompt for one
 */
export default function retrieveUdacityAuthToken() {
  return new Promise((resolve, reject) => {
    const token = config.get(CLI_CONFIG_UDACITY_AUTH_TOKEN);

    if (token) {
      resolve(token);
      return;
    }

    logger.warn('Udacity authentication token hasn\'t been set.');
    promptInputUdacityAuthToken()
      .then(token => validateSaveUdacityAuthToken(token))
      .then(token => resolve(token));
  });
}
