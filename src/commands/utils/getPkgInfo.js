const pkginfo = require('pkginfo')(module); // eslint-disable-line


/**
 * Retrieve information of package
 * @returns {string} package information
 */
export default function getPkgInfo() {
  const packageInfo = module.exports; // refer to pkginfo

  return packageInfo;
}
