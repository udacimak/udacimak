#!/usr/bin/env node
import {
  validateSaveUdacityAuthToken,
} from '../functions';


/**
 * Check if the authentication token is valid
 * and save it locally
 * @param {string} token Udacity authentication
 */
export default function setToken(token) {
  validateSaveUdacityAuthToken(token);
}
