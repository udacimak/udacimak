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

  const answers = [];
  const solution = [];
  for (const answer of atom.question.answers) {
    const { id, text, is_correct } = answer;

    // if this is the correct answer, add to solution
    if ('is_correct' in answer && is_correct !== null && is_correct === true) {
      solution.push(answer);
    }

    answers.push({
      id,
      name: atom.id,
      text: markdownToHtml(text),
    });
  }

  return loadTemplate('atom.checkboxQuiz')
    .then((html) => {
      const dataTemplate = {
        answers,
        solution,
        prompt,
      };
      const template = Handlebars.compile(html);
      return template(dataTemplate);
    });
}
