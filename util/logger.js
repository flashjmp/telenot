const winston = require('winston');
const config = require('./../config/config');

let loglevel = config.LogLevel;

// get log level from environment variable (fallback config file)
const logLevels = ['error', 'warn', 'info', 'verbose', 'debug', 'silly'];
if (!logLevels.includes(loglevel)) {
  loglevel = 'info';
}

const { createLogger, format, transports } = require('winston');
const { json } = require('express/lib/response');
const { splat, combine, timestamp, label, printf, simple } = format;
const colorizer = winston.format.colorize();

const myFormat = printf( ({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

module.exports = {
  logger: winston.createLogger({
    level: loglevel,
    format: winston.format.json(),    
    //format: winston.format.combine(winston.format.colorize(), alignColorsAndTime),
    transports: [
      //
      // - Write to all logs with level `info` and below to `combined.log`
      // - Write all logs error (and below) to `error.log`.
      //
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' }),
    ],
  }),
  //
  // If we're not in production then log to the `console` with the format:
  // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
  //
  setLogLevelProd(logger) {
    if (process.env.NODE_ENV !== 'production') {
      const combinedLogs = logger.transports.find(transport => transport.filename === 'combined.log');
      logger.remove(combinedLogs);
      logger.add(new winston.transports.Console({
        //format: winston.format.simple(),
        //format: myFormat,
        format: combine(
          //label({ label: 'CUSTOM', message: true }),
          timestamp(),
           myFormat
        ),
      }));
    }
  },
};
