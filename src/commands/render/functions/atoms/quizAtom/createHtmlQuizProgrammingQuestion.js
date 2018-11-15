import Handlebars from 'handlebars';
import { loadTemplate } from '../../templates';


/**
 * Create HTML for ImageFormQuestion type of QuizAtom
 * @param {object} atom atom JSON
 */
export default async function createHtmlQuizProgrammingQuestion(atom) {
  const files = [];
  let active; let id; let isSelected; let file; let name; let
    text;
  for (let i = 0, len = atom.question.initial_code_files.length; i < len; i += 1) {
    file = atom.question.initial_code_files[i];
    // add active class for first elements
    active = (i === 0) ? ' active show' : '';
    isSelected = (i === 0);
    id = `${atom.id}-${file.name.replace('.', '-').replace(' ', '-')}`;
    ({ name } = file);
    ({ text } = file);
    files.push({
      active,
      id,
      isSelected,
      name,
      text,
    });
  } //.for

  const html = await loadTemplate('atom.quiz.programmingQuestion');

  const template = Handlebars.compile(html);
  const dataTemplate = {
    id: 'question',
    files,
  };

  return template(dataTemplate);
}
