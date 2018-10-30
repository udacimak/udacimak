import {
  fetchUdacityUserInfo
} from '../../../api';


/**
 * Get user's Nanodegree information
 * @param {string} ndKey Nanodegree key/id
 * @param {string} token Udacity authentication token
 */
export default function retrieveUserNanodegreeInfo(ndKey, token) {
  return fetchUdacityUserInfo(token)
    .then(res => {
      const { graduated_nanodegrees, nanodegrees } = res.data.user;
      let nanodegree = null;
      for (const _nanodegree of graduated_nanodegrees) {
        if (ndKey === _nanodegree.key) {
          nanodegree = _nanodegree;
          break;
        }
      }

      // check enrolled nanodegrees if not found nkKey in graduated nanodegrees
      if (!nanodegree) {
        for (const _nanodegree of nanodegrees) {
          if (ndKey === _nanodegree.key) {
            nanodegree = _nanodegree;
            break;
          }
        }
      }

      return nanodegree;
    });
}