import Handlebars from 'handlebars';
import { loadTemplate } from '../templates';
import { markdownToHtml } from '../../../utils';


/**
 * Create HTML content for RadioQuizAtom
 * @param {object} atom atom json
 * @returns {string} HTML content
 */
export default function createHtmlRadioQuizAtom(atom) {
  const prompt = markdownToHtml(atom.question.prompt);

  const answers = [];
  let solution;
  for (const answer of atom.question.answers) {
    let { id, text, is_correct } = answer;
    text = markdownToHtml(text);

    // if this is the correct answer, add to solution
    if ('is_correct' in answer && is_correct !== null && is_correct === true) {
      solution = answer;
    }

    answers.push({
      id,
      name: atom.id,
      text,
    });
  }

  return loadTemplate('atom.radioQuiz')
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
