import Handlebars from 'handlebars';
import { loadTemplate } from '../templates';
import { markdownToHtml } from '../../../utils';


/**
 * Create HTML content for MatchingQuizAtom
 * @param {object} atom atom json
 * @returns {string} HTML content
 */
export default function createHtmlMatchingQuizAtom(atom) {
  const { question } = atom;
  const prompt = markdownToHtml(question.complex_prompt.text);
  const concepts = [];
  const answers = [];
  const solutions = [];
  const conceptsLabel = markdownToHtml(question.concepts_label);
  const answersLabel = markdownToHtml(question.answers_label);
  for (const concept of question.concepts) {
    concepts.push({
      text: markdownToHtml(concept.text),
    });
  }
  for (const answer of question.answers) {
    answers.push({
      text: markdownToHtml(answer.text),
    });

    // create solution
    for (const concept of question.concepts) {
      const { correct_answer } = concept;
      if (correct_answer && correct_answer.text && correct_answer.text.toLowerCase().trim() === answer.text.toLowerCase().trim()) {
        solutions.push({
          answerText: markdownToHtml(answer.text),
          matchingConcept: markdownToHtml(concept.text),
        });
      }
    }
  }

  return loadTemplate('atom.matchingQuiz')
    .then((html) => {
      const dataTemplate = {
        answers,
        answersLabel,
        concepts,
        conceptsLabel,
        solutions,
        prompt,
      };
      const template = Handlebars.compile(html);
      return template(dataTemplate);
    });
}
