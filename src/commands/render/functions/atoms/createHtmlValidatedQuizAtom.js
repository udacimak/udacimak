import Handlebars from 'handlebars';
import { loadTemplate } from '../templates';
import { createHtmlText } from '../utils';


/**
 * Create HTML content for ValidatedQuizAtom
 * @param {object} atom atom json
 * @param {string} targetDir output directory path
 * @returns {string} HTML content
 */
export default async function createHtmlValidatedQuizAtom(atom, targetDir) {
  const prompt = await createHtmlText(atom.question.prompt, targetDir, atom.id);
  const matchers = [];

  for (let i = 0, len = atom.question.matchers; i < len; i += 1) {
    const matcher = matchers[i];
    matchers.push(matcher.expression);
  }

  const html = await loadTemplate('atom.validatedQuiz');
  const template = Handlebars.compile(html);
  const data = {
    prompt,
    matchers,
  };

  return template(data);
}
