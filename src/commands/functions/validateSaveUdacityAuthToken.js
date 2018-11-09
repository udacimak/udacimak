import ora from 'ora';
import {
  config,
  logger,
} from '../utils';
import {
  fetchUdacityUserInfo,
} from '../../api';
import {
  CLI_CONFIG_UDACITY_AUTH_TOKEN,
} from '../../config';


/**
 * Validate a token by sending request to Udacity API and save it
 * if it is valid
 * @param {string} token Udacity authentication token
 */
export default async function validateSaveUdacityAuthToken(token) {
  const spinner = ora('Validate Udacity authentication token via Udacity API').start();

  try {
    const res = await fetchUdacityUserInfo(token);

    if (!res.data || !res.data.user) {
      spinner.fail();
      logger.error(`Could not validate your Udacity token. Please try again. Here's the error message:
      ${res.body}`);
      return null;
    }
    // save token
    config.set(CLI_CONFIG_UDACITY_AUTH_TOKEN, token);
    spinner.succeed();

    const { user } = res.data;
    const name = user.nickname || user.first_name;
    const msgSuccess = 'You have successfully saved authentication token locally!';
    if (name) {
      logger.info(`Hi ${name}. ${msgSuccess}`);
    } else {
      logger.info(`${msgSuccess}`);
    }

    return token;
  } catch (error) {
    spinner.fail();
    logger.error(`Failed to validate your Udacity token. Please try again. Here's the error message:
${JSON.stringify(error, null, 4)}`);
    return null;
  }
}
