import Handlebars from 'handlebars';
import { loadTemplate } from '../../templates';


/**
 * Create HTML of user's answer for Programming Question
 * @param {object} userState user_state JSON from atom
 */
export default async function createHtmlProgrammingQuestionUserAnswer(userState) {
  if (!userState || !userState.unstructured || !userState.unstructured.trim()) return '';

  try {
    const unstructured = JSON.parse(userState.unstructured);
    const files = [];

    let i = 0;
    let active; let id; let isSelected;
    Object.keys(unstructured).forEach((filename) => {
      const text = unstructured[filename];

      // add active class for first elements
      active = (i === 0) ? ' active show' : '';
      isSelected = (i === 0);
      id = `user-answer-${userState.node_key || ''}-${filename.replace('.', '-').replace(' ', '-')}`;

      files.push({
        active,
        id,
        isSelected,
        name: filename,
        text,
      });

      i += 1;
    }); //.forEach

    const html = await loadTemplate('atom.quiz.programmingQuestion');

    const template = Handlebars.compile(html);
    const dataTemplate = {
      id: 'user-answer',
      files,
    };

    return template(dataTemplate);
  } catch (error) {
    return '';
  }
}
