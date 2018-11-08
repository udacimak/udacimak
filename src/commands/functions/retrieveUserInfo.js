import { fetchUdacityUserInfo } from '../../api';
import { logger } from '../utils';


/**
 * Retrieve user information
 * @param {string} token Udacity authentication token
 */
export default function retrieveUserInfo(token) {
  return fetchUdacityUserInfo(token)
    .then((res) => {
      if (!res.data || !res.data.user) {
        logger.error(`Could not fetch user information with error:
        ${res.body}`);
        return null;
      }

      return res.data.user;
    });
}
