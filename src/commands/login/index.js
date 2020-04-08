import {
  authenticate,
} from '../functions';


/**
 * Login to audacity and save the token locally
 * @param {string} login Udacity authentication
 */
export default function login() {
  authenticate();
}
