const { createLogger, format, transports } = require('winston');
const { colorize, combine, timestamp, label, printf } = format;


/**
 * Customer winston logger format
 */
const myFormat = printf(info => {
  const { error, level, message, timestamp } = info;

  return `${timestamp} [${level}]: ${message}`;
});

/**
 * Customer logger
 */
const logger = createLogger({
  format: combine(
    colorize(),
    label({ label: '' }),
    timestamp(),
    myFormat
  ),
  exitOnError: true,
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'udacimak.error.log', level: 'error' }),
    new transports.File({ filename: 'udacimak.info.log' }),
  ],
  exceptionHandlers: [
    new transports.Console(),
    new transports.File({ filename: 'udacimak.exceptions.log' })
  ]
});

export default logger;