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
  for (let i = 0, len = atom.question.answers.length; i < len; i += 1) {
    const answer = atom.question.answers[i];
    const { id } = answer;
    const isCorrect = answer.is_correct;
    const text = markdownToHtml(answer.text);

    // if this is the correct answer, add to solution
    if ('is_correct' in answer && isCorrect !== null && isCorrect === true) {
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
