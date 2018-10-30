
import { markdownToHtml } from '../../../utils';


/**
 * Create HTML for rubric items
 * @param {object} rubricItems JSON data for rubric items
 * @returns {string} rubric items HTML
 */
export default function createHtmlRubricItems(rubricItems) {
  let html = '';
  let htmlItems = '';

  for (const rubric of rubricItems) {
    let { criteria, passed_description } = rubric;
    criteria = markdownToHtml(criteria);
    passed_description = markdownToHtml(passed_description);
    htmlItems += `
      <tr scope="row">
        <td>
          ${criteria}
        </td>
        <td>
          ${passed_description}
        </td>
      </tr>
    `;
  }

  html += `
    <tbody>
      ${htmlItems}
    </tbody>
  `;

  return html;
}