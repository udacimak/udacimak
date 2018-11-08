import Handlebars, { template } from 'handlebars';
import { loadTemplate } from '../templates';
import { filenamify } from '../../../utils';


/**
 * Create HTML for table of content on the sidebar for lessons
 * @param {object} lesson lesson JSON data
 */
export default function createHtmlSidebarLesson(lesson) {
  const list = [];
  const {
    concepts, lab, project, rubric, title,
  } = lesson;

  // generate list items for concepts
  for (let i = 0, len = concepts.length; i < len; i++) {
    const concept = concepts[i];
    const prefix = i + 1 < 10 ? `0${i + 1}` : i + 1;
    const link = `${prefix}. ${filenamify(concept.title)}.html`;
    const title = `${prefix}. ${concept.title}`;
    list.push({
      link,
      title,
    });
  }

  // generate list item for project description
  if (project) {
    const { title } = project;
    const prefix = 'Project Description';
    const link = filenamify(`${prefix} - ${title}.html`);
    list.push({
      link,
      title: `${prefix} - ${title}`,
    });
  } //.if project

  // generate list item for lab
  if (lab) {
    const { title } = lab;
    const prefix = 'Lab';
    const link = filenamify(`${prefix} - ${title}.html`);
    list.push({
      link,
      title: `${prefix} - ${title}`,
    });
  } //.if lab

  if (rubric) {
    const prefix = 'Project Rubric';
    const link = filenamify(`${prefix} - ${project.title}.html`);
    list.push({
      link,
      title: `${prefix} - ${project.title}`,
    });
  } //.if rubric

  const bottomLinks = [
    {
      title: 'Back to Home',
      link: '../index.html',
    },
  ];

  return loadTemplate('sidebar')
    .then((html) => {
      const template = Handlebars.compile(html);
      const dataTemplate = {
        bottomLinks,
        title,
        list,
      };

      return template(dataTemplate);
    });
}
