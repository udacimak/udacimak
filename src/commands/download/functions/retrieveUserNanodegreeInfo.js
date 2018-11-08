import {
  fetchUdacityUserInfo,
} from '../../../api';


/**
 * Get user's Nanodegree information
 * @param {string} ndKey Nanodegree key/id
 * @param {string} token Udacity authentication token
 */
export default function retrieveUserNanodegreeInfo(ndKey, token) {
  return fetchUdacityUserInfo(token)
    .then((res) => {
      const { nanodegrees } = res.data.user;
      const graduatedNanodegrees = res.data.user.graduated_nanodegrees;
      let nanodegree = null;
      for (let i = 0, len = graduatedNanodegrees.length; i < len; i += 1) {
        const nd = graduatedNanodegrees[i];
        if (ndKey === nd.key) {
          nanodegree = nd;
          break;
        }
      }

      // check enrolled nanodegrees if not found nkKey in graduated nanodegrees
      if (!nanodegree) {
        for (let i = 0, len = nanodegrees.length; i < len; i += 1) {
          const nd = nanodegrees[i];
          if (ndKey === nd.key) {
            nanodegree = nd;
            break;
          }
        }
      }

      return nanodegree;
    });
}
