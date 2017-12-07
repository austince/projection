/**
 * Created by austin on 4/4/17.
 */
// Using the command line arguments to determine env
const winston = require('winston');
const expressWinston = require('express-winston');
const fs = require('fs');
const { config } = require('../config');
// import config from '../../common/config';

let httpLogger;
let logger;

// Create the log directory to store the logfiles
if (!fs.existsSync('./logs')) {
  fs.mkdirSync('./logs');
}

switch (config.env) {
  case 'dev':
  case 'development':
    // Output to the console when in development or testing
    logger = new winston.Logger({
      transports: [
        new winston.transports.Console({
          colorize: true,
        }),
      ],
    });
    httpLogger = expressWinston.logger({
      winstonInstance: logger,
      expressFormat: true,
      colorize: true,
    });
    break;
  default: // Production
    // Write to specific log files in production
    logger = new winston.Logger({
      transports: [
        new winston.transports.File({
          name: 'Console Log',
          filename: `./logs/${config.logs.consoleFilename}`,
          timestamp: true,
        }),
        // Overwrite all error logging
        new winston.transports.File({
          name: 'Error Log',
          filename: `./logs/${config.logs.errorFilename}`,
          timestamp: true,
          level: 'error',
        }),
      ],
    });

    httpLogger = expressWinston.logger({
      transports: [
        new winston.transports.File({
          name: 'Access Log',
          filename: `./logs/${config.logs.accessFilename}`,
          timestamp: true,
        }),
      ],
      expressFormat: true,
      colorize: true,
    });
}

module.exports = {
  httpLogger,
  logger,
};
