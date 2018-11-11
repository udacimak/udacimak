import request from 'request';
import getPkgInfo from './getPkgInfo';
import { API_ENDPOINTS_NPMS_PACKAGE } from '../../config';


/**
 * Fetch the latest information of the package from npm registry
 */
export default function fetchPackageInfo() {
  const appName = getPkgInfo().name;

  const url = `${API_ENDPOINTS_NPMS_PACKAGE}/${appName}`;

  const options = {
    url,
    method: 'GET',
  };

  return new Promise((resolve, reject) => {
    request(options, (error, res) => {
      if (error) {
        reject(error);
      } else {
        try {
          const jsonRes = JSON.parse(res.body);
          resolve(jsonRes.collected.metadata);
        } catch (errorJson) {
          reject(errorJson);
        }
      }
    });
  });
}
