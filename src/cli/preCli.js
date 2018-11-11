import { notifyLatestVersion } from '../commands/utils';


/**
 * Functions to run before excecuting a command
 */
export default async function preCli() {
  try {
    await notifyLatestVersion();
  } catch (error) {
    // Do nothing
  }
}
