"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fetchProjectRubric;

var _ = require(".");

/**
 * Fetch project rubric from Udacity API
 * @param {number} rubricId rubric id
 * @param {string} token Udacity authentication token
 */
function fetchProjectRubric(rubricId, token) {
  const url = `https://review-api.udacity.com/api/v1/rubrics/${rubricId}.json`;
  return (0, _.fetchApiUdacity)(url, token);
}