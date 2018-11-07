import request from 'request';
import { config } from '../commands/utils';
import {
  CLI_CONFIG_UDACITY_AUTH_TOKEN
} from '../config';


/**
 * Send request to Udacity API
 * @param {string} url request url
 * @param {string} queryGraphql graphQl Query
 * @param {string} udacityAuthToken Udacity authentication token
 */
export default function fetchApiUdacityGraphql(url, queryGraphql, udacityAuthToken = '') {
  if (!udacityAuthToken) {
    udacityAuthToken = config.get(CLI_CONFIG_UDACITY_AUTH_TOKEN);
  }

  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${udacityAuthToken}`,
    'Content-Type': 'application/json; charset=UTF-8',
    Host: 'classroom-content.udacity.com',
    Origin: 'https://classroom.udacity.com',
    Referer: 'https://classroom.udacity.com/me',
    // https://github.com/request/request/issues/2047#issuecomment-272473278
    Connection: 'keep-alive'      
  };
  const method = 'POST';
  const requestOptions = {
    url,
    body: queryGraphql,
    method,
    headers,
    forever: true
  };

  return new Promise((resolve, reject) => {
    request(requestOptions, (error, res) => {
      if (error) {
        reject({error, requestOptions, res});
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