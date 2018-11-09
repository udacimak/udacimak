import serializeError from 'serialize-error';


/**
 * Seralize error object and construct error message that shows all
 * error information
 * @param {object} error Node error object
 * @returns {string} error message
 */
export default function getFullErrorMessage(error) {
  const _error = serializeError(error);
  let str = '';

  const {
    name, code, message, stack,
  } = _error;

  if (name) str += `${name.toUpperCase()}: `;

  if (message) str += `${message}\n`;

  if (code) str += `CODE: ${code}\n`;

  if (stack) str += `STACK: ${stack}`;

  return str || JSON.stringify(error, null, 4) || error;
}
