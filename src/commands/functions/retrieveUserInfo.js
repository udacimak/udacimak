import { fetchUdacityUserInfo } from '../../api';
import { logger } from '../utils';


/**
 * Retrieve user information
 * @param {string} token Udacity authentication token
 */
export default async function retrieveUserInfo(token) {
  try {
    const res = await fetchUdacityUserInfo(token);

    if (!res.data || !res.data.user) {
      logger.error(`Could not fetch user information with error:
      ${res.body}`);
      return null;
    }

    return res.data.user;
  } catch (error) {
    throw error;
  }
}
