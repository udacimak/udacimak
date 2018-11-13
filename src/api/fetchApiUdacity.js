import request from 'request';
import { config } from '../commands/utils';
import {
  CLI_CONFIG_UDACITY_AUTH_TOKEN,
} from '../config';


/**
 * Send request to Udacity API
 * @param {string} url request url
 * @param {string} udacityAuthToken Udacity authentication token
 */
export default function fetchApiUdacity(url, udacityAuthToken = '') {
  if (!udacityAuthToken) {
    udacityAuthToken = config.get(CLI_CONFIG_UDACITY_AUTH_TOKEN);
  }

  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${udacityAuthToken}`,
    Host: 'review-api.udacity.com',
    Origin: 'https://review.udacity.com',
    Referer: 'https://review.udacity.com',
    // https://github.com/request/request/issues/2047#issuecomment-272473278
    // avoid socket hang up error
    Connection: 'keep-alive',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36',
  };
  const method = 'GET';
  const requestOptions = {
    url,
    method,
    headers,
    // avoid socket hang up error
    forever: true,
  };

  return new Promise((resolve, reject) => {
    request(requestOptions, (error, res) => {
      if (error) {
        reject(new Error(error));
      } else {
        const jsonRes = JSON.parse(res.body);
        if (jsonRes.errors) {
          reject(jsonRes.errors);
        } else {
          resolve(jsonRes);
        }
      }
    });
  });
}
