import Handlebars from 'handlebars';
import { loadTemplate } from '../templates';
import { createHtmlText } from '../utils';


/**
 * Create HTML content for RadioQuizAtom
 * @param {object} atom atom json
 * @param {string} targetDir output directory path
 * @returns {string} HTML content
 */
export default async function createHtmlRadioQuizAtom(atom, targetDir) {
  const prompt = await createHtmlText(atom.question.prompt, targetDir, atom.id);

  const answers = [];
  let solution;
  for (let i = 0, len = atom.question.answers.length; i < len; i += 1) {
    const answer = atom.question.answers[i];
    const { id } = answer;
    const isCorrect = answer.is_correct;
    const text = await createHtmlText(answer.text, targetDir, atom.id);

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

  const html = await loadTemplate('atom.radioQuiz');
  const dataTemplate = {
    answers,
    solution,
    prompt,
  };
  const template = Handlebars.compile(html);
  return template(dataTemplate);
}
