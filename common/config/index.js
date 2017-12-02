import { merge } from 'lodash';

import baseConfig from './base.json';

const env = process.env.NODE_ENV;

let envConfig;
console.info(`Using config for env: ${env}`);
switch (env) {
  case 'dev':
  case 'development':
    envConfig = require('./development.json'); // eslint-disable-line
    break;
  case 'production':
    envConfig = require('./production.json'); // eslint-disable-line
    break;
  default:
    console.warn(`No config file for: ${env}!`);
}

const config = merge(
  {},
  baseConfig,
  envConfig,
);
config.env = env;

export {
  config,
};

export default {
  config,
};

