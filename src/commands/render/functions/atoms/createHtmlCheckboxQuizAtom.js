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
  for (let i = 0, len = atom.question.answers.length; i < len; i += 1) {
    const answer = atom.question.answers[i];
    const { id, text } = answer;
    const isCorrect = answer.is_correct;

    // if this is the correct answer, add to solution
    if ('is_correct' in answer && isCorrect !== null && isCorrect === true) {
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
