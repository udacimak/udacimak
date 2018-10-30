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
  let matchers = [];

  for (const matcher of atom.question.matchers) {
    matchers.push(matcher.expression);
  }

  return loadTemplate('atom.validatedQuiz')
    .then(html => {
      const template = Handlebars.compile(html);
      const data = {
        prompt,
        matchers
      };

      return template(data);
    });
}