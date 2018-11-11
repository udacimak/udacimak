import settings from 'user-settings';
import getPkgInfo from './getPkgInfo';


class Config {
  constructor() {
    const appName = getPkgInfo().name;
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
