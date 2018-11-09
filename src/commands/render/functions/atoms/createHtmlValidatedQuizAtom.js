import Handlebars from 'handlebars';
import { markdownToHtml } from '../../../utils';
import { loadTemplate } from '../templates';


/**
 * Create HTML content for ValidatedQuizAtom
 * @param {object} atom atom json
 * @returns {string} HTML content
 */
export default async function createHtmlValidatedQuizAtom(atom) {
  const prompt = markdownToHtml(atom.question.prompt);
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
