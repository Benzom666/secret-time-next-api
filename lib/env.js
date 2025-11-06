/* eslint-disable prefer-destructuring */
const fs = require('fs');
const _ = require('lodash');
let logger;

// Prefer your configured Winston logger; fall back to console if not available
try {
  logger = require('../config/winston');
} catch {
  logger = console;
}

// Load env from .env if present (local dev); in Render we rely on real env vars
require('dotenv').config();

// Optional: also read ../.env if it exists (keeps your old behavior without crashing)
try {
  const envPath = `${__dirname}/../.env`;
  if (fs.existsSync(envPath)) {
    let env = fs.readFileSync(envPath, 'utf8').split('\n');
    _.each(env, (key) => {
      const matches = key.match(/^([^=]+)=["']?(.*)["']?$/);
      if (matches) process.env[matches[1]] = matches[2];
    });
    logger.info('Loaded environment from ../.env');
  } else {
    logger.info('No ../.env file found; using process.env only');
  }
} catch (e) {
  logger.info('Skipping ../.env load; using process.env only');
}

// Normalize Mongo env name: accept either MONGO_URI or MONGODB_URI
if (!process.env.MONGO_URI && process.env.MONGODB_URI) {
  process.env.MONGO_URI = process.env.MONGODB_URI;
}

// Required keys (keep minimal to avoid false negatives in hosted envs)
const requiredKeys = {
  MONGO_URI: { required: true },
  // APP_URL: { required: true }, // make optional; uncomment if you truly need it
};

_.each(requiredKeys, (value, key) => {
  if (value.required && !process.env[key]) {
    logger.error(`Environment variable ${key} not found!`);
    process.exit(1);
  }
});

module.exports = {
  // export what other modules expect (helpful if you import this)
  MONGO_URI: process.env.MONGO_URI,
  APP_URL: process.env.APP_URL,
};
