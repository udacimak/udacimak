import Handlebars from 'handlebars';
import { loadTemplate } from '../../templates';


/**
 * Create HTML for ImageFormQuestion type of QuizAtom
 * @param {object} atom atom JSON
 */
export default function createHtmlQuizProgrammingQuestion(atom) {
  let files = [];
  let active, id, isSelected, file, name, text;
  for (let i = 0, len = atom.question.initial_code_files.length; i < len; i++) {
    file = atom.question.initial_code_files[i];
    // add active class for first elements
    active = (i === 0) ? ' active show' : '';
    isSelected = (i === 0);
    id = `${atom.id}-${file.name.replace('.', '-').replace(' ', '-')}`;
    name = file.name;
    text = file.text;
    files.push({
      active,
      id,
      isSelected,
      name,
      text
    });
  } //.for

  return loadTemplate('atom.quiz.programmingQuestion')
    .then(html => {
      const template = Handlebars.compile(html);
      const dataTemplate = {
        files
      };

      return template(dataTemplate);
    });
}