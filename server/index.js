require = require('@std/esm')(module); // eslint-disable-line no-global-assign
const io = require('socket.io');
const express = require('express');
const path = require('path');
const { Server } = require('http');

const { startFaceDetection } = require('./vision/face-detector');
const { httpLogger, logger } = require('./util/loggers');
const { config } = require('../common/config');

const app = express();

// Logging - to stdout in development, to files in production
app.use(httpLogger);
app.use(express.static(path.join(__dirname, '..', 'dist')));

const server = Server(app);
const socket = io(server);

socket.on('connection', (client) => {
  logger.info('New client');
});

// Todo: replace with dev env
if (config.env === 'dev' || config.env === 'development') {
  const webpack = require('webpack'); // eslint-disable-line
  const wpConfig = require('../webpack.config'); // eslint-disable-line
  wpConfig.watch = true;
  wpConfig.watchOptions = {
    aggregateTimeout: 500,
    poll: 500,
  };

  webpack(wpConfig, (err, stats) => {
    if (err) {
      logger.error(`Webpack build error: ${err.stack || err}`);
    } else {
      logger.info('Rebuilt bundles.');
      const statsInfo = stats.toJson();
      if (stats.hasErrors()) {
        logger.error(`Webpack build errors: ${statsInfo.errors}`);
      }
      if (stats.hasWarnings()) {
        logger.error(`Webpack build warnings: ${statsInfo.warnings}`);
      }
      logger.info(`Build took: ${statsInfo.time}ms`);
    }
  });
}

async function start() {
  logger.log('Starting server.');

  const detection$ = startFaceDetection();

  detection$.subscribe((faces) => {
    logger.log(faces);
    socket.emit('vision', faces);
  }, (err) => {
    logger.error(err);
  });
  return server.listen(config.sockets.port, () => {
    logger.info(`Listening on port: ${config.sockets.port}`);
  });
}

async function stop() {
  logger.log('Stoping server.');
  return server.close();
}

start().then(() => {
  logger.log('Server running.');
});
