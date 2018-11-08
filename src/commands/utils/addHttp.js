/**
 * Add htpps protocol to url if missing
 * @param {string} url
 * @returns {string} url with https protocol
 */
export default function addHttp(url) {
  url = url.trim();
  // this is a wrong protocol that exists in a JSON file in a Udacity Nanodegree...
  url = url.replace('https:///', '');
  if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
    url = `https:${url}`;
  }
  return url;
}
