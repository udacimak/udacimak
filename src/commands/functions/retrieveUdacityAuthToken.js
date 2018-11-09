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
export default async function retrieveUdacityAuthToken() {
  try {
    const savedToken = config.get(CLI_CONFIG_UDACITY_AUTH_TOKEN);

    if (savedToken) {
      return savedToken;
    }

    logger.warn('Udacity authentication token hasn\'t been set.');
    const token = await promptInputUdacityAuthToken();
    const tokenValidated = await validateSaveUdacityAuthToken(token);
    return tokenValidated;
  } catch (error) {
    throw error;
  }
}
