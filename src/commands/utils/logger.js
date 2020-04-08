const { createLogger, format, transports } = require('winston');

const {
  colorize, combine, timestamp, label, printf,
} = format;

/**
 * Customer winston logger format
 */
const myFormat = printf((info) => {
  const { level, message } = info;
  const infoTimestamp = info.timestamp;
  return `${infoTimestamp} [${level}]: ${message}`;
});

/**
 * Customer logger
 */
const logger = createLogger({
  level: 'verbose',
  format: combine(
    colorize(),
    label({ label: '' }),
    timestamp(),
    myFormat,
  ),
  exitOnError: true,
  transports: [
    new transports.Console(),
  ],
  exceptionHandlers: [
    new transports.Console(),
  ],
});

export default logger;
