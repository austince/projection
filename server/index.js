require = require('@std/esm')(module); // eslint-disable-line no-global-assign
const io = require('socket.io');
const express = require('express');
const path = require('path');
const { Server } = require('http');
const program = require('commander');

const { startDetection, stopDetection } = require('./vision/detector');
const { httpLogger, logger } = require('./util/loggers');

const { config } = require('./config');
const { version } = require('../package.json');

const app = express();

// Logging - to stdout in development, to files in production
app.use(httpLogger);
app.use(express.static(path.join(__dirname, '..', 'dist')));

const server = Server(app);
const socket = io(server);

socket.on('connection', (client) => {
  logger.info('New client');
});

function build() {
  const wpConfig = require('../webpack.config'); // eslint-disable-line
  wpConfig.watch = true;
  wpConfig.watchOptions = {
    aggregateTimeout: 500,
    poll: 500,
  };
  const webpack = require('webpack'); // eslint-disable-line

  return new Promise((resolve, reject) => {
    webpack(wpConfig, (err, stats) => {
      if (err) {
        logger.error(`Webpack build error: ${err.stack || err}`);
        reject(err);
      } else {
        logger.info(`Rebuilt bundles at ${(new Date()).getHours()}:${(new Date()).getMinutes()}:${(new Date()).getSeconds()}`);
        const statsInfo = stats.toJson();
        if (stats.hasErrors()) {
          logger.error(`Webpack build errors: ${statsInfo.errors}`);
        }
        if (stats.hasWarnings()) {
          logger.error(`Webpack build warnings: ${statsInfo.warnings}`);
        }
        logger.info(`Build took: ${statsInfo.time}ms`);

        resolve();
      }
    });
  });
}


async function start(args) {
  logger.log('Starting server.');

  if (config.env === 'dev' || config.env === 'development') {
    logger.info('Building...');
    await build();
  }

  if (args.cv) {
    logger.log('Starting vision detection.');
    const detection$ = startDetection();

    detection$.subscribe((objects) => {
      logger.log(objects);
      socket.emit('vision', objects);
    }, (err) => {
      logger.error(err);
    });
  }

  return server.listen(config.sockets.port, () => {
    logger.info(`Listening on port: ${config.sockets.port}`);
  });
}

async function stop() {
  logger.log('Stoping server.');
  stopDetection();
  return server.close();
}


program.version(version)
  .option('--no-cv', 'No CV detection')
  .parse(process.argv);

(async () => {
  await start(program);
  logger.log('Server running.');
})();
