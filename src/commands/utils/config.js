import settings from 'user-settings';
import { filenamify } from '.';

const pkginfo = require('pkginfo')(module);


class Config {
  constructor() {
    const packageInfo = module.exports; // refer to pkginfo
    const appName = packageInfo.name;
    // initialize user settings
    this.settings = settings.file(`.${appName}`);
  }

  get(key) {
    return this.settings.get(key);
  }

  set(key, value) {
    return this.settings.set(key, value);
  }

  unset(key) {
    return this.settings.unset(key);
  }
}

export default new Config();
