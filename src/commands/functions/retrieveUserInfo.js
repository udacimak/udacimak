import ora from 'ora';
import { fetchUdacityUserInfo } from '../../api';


/**
 * Retrieve user information
 * @param {string} token Udacity authentication token
 */
export default async function retrieveUserInfo(token) {
  const spinner = ora('Fetch user information via Udacity API');
  try {
    spinner.start();
    const res = await fetchUdacityUserInfo(token);
    spinner.succeed();

    if (!res.data || !res.data.user) {
      spinner.fail();
      throw new Error(`Could not fetch user information with error:
      ${res.body}`);
    }

    return res.data.user;
  } catch (error) {
    spinner.fail();
    throw error;
  }
}
