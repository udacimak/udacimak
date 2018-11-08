import Handlebars from 'handlebars';
import { markdownToHtml } from '../../../utils';
import { loadTemplate } from '../templates';


/**
 * Create HTML content for ValidatedQuizAtom
 * @param {object} atom atom json
 * @returns {string} HTML content
 */
export default function createHtmlValidatedQuizAtom(atom) {
  const prompt = markdownToHtml(atom.question.prompt);
  const matchers = [];

  for (let i = 0, len = atom.question.matchers; i < len; i += 1) {
    const matcher = matchers[i];
    matchers.push(matcher.expression);
  }

  return loadTemplate('atom.validatedQuiz')
    .then((html) => {
      const template = Handlebars.compile(html);
      const data = {
        prompt,
        matchers,
      };

      return template(data);
    });
}
