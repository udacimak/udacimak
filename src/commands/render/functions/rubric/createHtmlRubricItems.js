
import { markdownToHtml } from '../../../utils';


/**
 * Create HTML for rubric items
 * @param {object} rubricItems JSON data for rubric items
 * @returns {string} rubric items HTML
 */
export default function createHtmlRubricItems(rubricItems) {
  let html = '';
  let htmlItems = '';

  for (let i = 0, len = rubricItems.length; i < len; i += 1) {
    const rubric = rubricItems[i];
    let { criteria } = rubric;
    criteria = markdownToHtml(criteria);
    const passedDescription = markdownToHtml(rubric.passed_description);
    htmlItems += `
      <tr scope="row">
        <td>
          ${criteria}
        </td>
        <td>
          ${passedDescription}
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
