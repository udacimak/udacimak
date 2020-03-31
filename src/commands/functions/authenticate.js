import {
  validateSaveUdacityAuthToken,
} from '.';

const axios = require('axios');
const prompt = require('prompt');

const postData = {
  email: '',
  password: '',
  otp: '',
  next: 'https://classroom.udacity.com/authenticated',
};

const axiosConfig = {
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
    postData.email = result.email;
    postData.password = result.password;
    axios.post('https://user-api.udacity.com/signin', postData, axiosConfig)
      .then((res) => {
        validateSaveUdacityAuthToken(res.data.jwt);
      })
      .catch((error) => {
        console.error(error.response.data.message);
      });
    return 0;
  });
}
