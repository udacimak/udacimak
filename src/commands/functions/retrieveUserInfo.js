import { fetchUdacityUserInfo } from '../../api';


/**
 * Retrieve user information
 * @param {string} token Udacity authentication token
 */
export default function retrieveUserInfo(token) {
  return fetchUdacityUserInfo(token)
    .then(res => {
      if (!res.data || !res.data.user) {
        logger.error(`Could not fetch user information with error:
        ${res.body}`);
        return;
      }

      return res.data.user;
    });
}