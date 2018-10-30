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
    let concepts = [];
    let answers = [];
    let conceptsLabel = markdownToHtml(question.concepts_label);
    let answersLabel = markdownToHtml(question.answers_label);
    for (const concept of question.concepts) {
      concepts.push({
        text: markdownToHtml(concept.text)
      });
    }
    for (const answer of question.answers) {
      answers.push({
        text: markdownToHtml(answer.text)
      });
    }

    return loadTemplate('atom.matchingQuiz')
      .then(html => {
        const dataTemplate = {
          answers,
          answersLabel,
          concepts,
          conceptsLabel,
          prompt
        };
        const template = Handlebars.compile(html);
        return template(dataTemplate);
      });
}