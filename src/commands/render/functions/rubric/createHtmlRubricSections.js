import { createHtmlRubricItems } from '.';
import { markdownToHtml } from '../../../utils';


/**
 * Create Html for rubric section
 * @param {object} sections JSON data for rubric sections
 * @returns {string} section html
 */
export default function createHtmlRubricSections(sections) {
  let html = '';

  // loop and create html for each section
  for (let i = 0, len = sections.length; i < len; i += 1) {
    const section = sections[i];
    const { name } = section;

    // create html for rubric items
    const htmlRubricItems = createHtmlRubricItems(section.rubric_items);

    // create section html
    html += `
      <div>
        <h2>${markdownToHtml(name)}</h2>
        <table class="table table-bordered table-hover">
          <thead>
            <tr class="thead-dark">
              <th>Criteria</th>
              <th>Meet Specification</th>
            </tr>
          </thead>
          ${htmlRubricItems}
        </table>

      </div>
    `;
  }

  return html;
}
