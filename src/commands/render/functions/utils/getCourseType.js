import fs from 'fs';


/**
 * Check is this folder contains nanodegree, course or what
 * @param {string} jsonPath path to json file
 * @returns {string} course type
 */
export default function getCourseType(jsonPath, filename = 'data.json') {
  const pathData = `${jsonPath}/${filename}`;

  // read json file for data
  let courseType;
  let data = fs.readFileSync(pathData, 'utf-8');
  data = JSON.parse(data);
  ({ data } = data);

  if (data.nanodegree) courseType = 'NANODEGREE';
  else if (data.course) courseType = 'COURSE';
  else courseType = 'UNKNOWN';

  return courseType;
}
