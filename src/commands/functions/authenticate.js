import {
  validateSaveUdacityAuthToken,
} from '.';

const request = require('request');
const prompt = require('prompt');

const options = {
  url: 'https://user-api.udacity.com/signin',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:74.0) Gecko/20100101 Firefox/74.0',
    Accept: 'application/json',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate',
    Referer: 'https://auth.udacity.com/sign-in?next=https%3A%2F%2Fclassroom.udacity.com%2Fauthenticated',
    'Content-Type': 'application/json;charset=UTF-8',
    'X-Udacity-Ads-Are-Blocked': 'unknown',
    Origin: 'https://auth.udacity.com',
  },
  gzip: true,
  json: {
    email: '',
    password: '',
    otp: '',
    next: 'https://classroom.udacity.com/authenticated',
  },
};

const schema = {
  properties: {
    email: {
      required: true,
    },
    password: {
      hidden: true,
      required: true,
    },
  },
};

function onErr(err) {
  console.log(err);
  return 1;
}

export default async function authenticate() {
  prompt.start();

  prompt.get(schema, (err, result) => {
    if (err) { return onErr(err); }
    options.json.email = result.email;
    options.json.password = result.password;
    request.post(options, (error, response, body) => {
      if (error) {
        console.error(error);
        return 1;
      }
      if (response.statusCode !== 200) {
        console.error(body.message);
        return 1;
      }
      validateSaveUdacityAuthToken(body.jwt);
      return 0;
    });
    return 0;
  });
}
