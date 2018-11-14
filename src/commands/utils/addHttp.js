/**
 * Add htpps protocol to url if missing
 * @param {string} url
 * @returns {string} url with https protocol
 */
export default function addHttp(url) {
  url = url.trim();
  // remove all protocols, JSON data sometimes contain invalid protocols
  // so it's best to remove them then add valid protocol again
  url = url
    .replace(/^(?:f|ht)tps?\:\/{1,}/, '')
    .replace(/^\/{1,}/, '');

  url = `https://${url}`;
  return url;
}
