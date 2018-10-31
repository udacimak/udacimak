import request from 'request';
import { config } from '../commands/utils';
import {
  CLI_CONFIG_UDACITY_AUTH_TOKEN
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
    Referer: 'https://review.udacity.com'
  };
  const method = 'GET';
  const requestOptions = {
    url,
    method,
    headers
  };

  return new Promise((resolve, reject) => {
    request(requestOptions, (error, res) => {
      if (error) {
        reject({error, requestOptions, res});
      } else{
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