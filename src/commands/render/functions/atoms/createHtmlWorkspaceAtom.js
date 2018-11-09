import Handlebars from 'handlebars';
import {
  loadTemplate,
} from '../templates';
import { markdownToHtml } from '../../../utils';


/**
 * Create HTML content for WorkspaceAtom
 * @param {object} atom atom json
 * @returns {string} HTML content
 */
export default async function createHtmlWorkspaceAtom(atom) {
  if (!atom) {
    return '(No Workspace data available)';
  }

  const { configuration } = atom;
  let defaultPath = '';
  let openFiles = [];
  let userCode;
  let kind = 'Unknown';

  // attempt to get workspace information
  if (configuration && configuration.blueprint) {
    ({ kind } = configuration.blueprint);
    const { conf } = configuration.blueprint;
    if (conf) {
      // Jupyter workspace usually has defaultPath
      if (conf.defaultPath) ({ defaultPath } = conf.defaultPath);
      // Coding workspace usually has openFiles
      if (conf.openFiles && conf.openFiles.length) {
        ({ openFiles } = conf.openFiles);
      }
      ({ userCode } = conf);
      userCode = markdownToHtml(userCode);
    } //.if conf
  } //.if configuration

  const html = await loadTemplate('atom.workspace');
  const data = {
    defaultPath,
    kind,
    openFiles,
    userCode,
  };

  const template = Handlebars.compile(html);
  return template(data);
}
