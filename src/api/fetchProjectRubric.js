import { fetchApiUdacity } from '.';


/**
 * Fetch project rubric from Udacity API
 * @param {number} rubricId rubric id
 * @param {string} token Udacity authentication token
 */
export default function fetchProjectRubric(rubricId, token) {
  const url = `https://review-api.udacity.com/api/v1/rubrics/${rubricId}.json`;
  return fetchApiUdacity(url, token);
}
