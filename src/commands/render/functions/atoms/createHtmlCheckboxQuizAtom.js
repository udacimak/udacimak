import Handlebars from 'handlebars';
import { loadTemplate } from '../templates';
import { markdownToHtml } from '../../../utils';


/**
 * Create HTML content for CheckboxQuizAtom
 * @param {object} atom atom json
 * @returns {string} HTML content
 */
export default function createHtmlCheckboxQuizAtom(atom) {
  const prompt = markdownToHtml(atom.question.prompt);

  let answers = [];
  for (const answer of atom.question.answers) {
    const { id, text } = answer;
    answers.push({
      id,
      name: atom.id,
      text: markdownToHtml(text)
    });
  }

  return loadTemplate('atom.checkboxQuiz')
    .then(html => {
      const dataTemplate = {
        answers,
        prompt
      };
      const template = Handlebars.compile(html);
      return template(dataTemplate);
    });
}