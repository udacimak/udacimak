/**
 * Split a string by the last hyphen
 * @param {string} str - The string to split
 * @returns {Array} - An array of strings
 */
export default function splitStringByLastHyphen(str) {
  // Find the last hyphen in the string
  const lastHyphenIndex = str.lastIndexOf('-');

  // Define the result array
  let result;

  // If there is a hyphen in the string, split the string into two parts
  if (lastHyphenIndex !== -1) {
    const part1 = str.slice(0, lastHyphenIndex);
    const part2 = str.slice(lastHyphenIndex + 1);
    result = [part1, part2];
  } else {
    // If there is no hyphen in the string, return the whole string as the first part
    result = [str];
  }

  return result;
}
