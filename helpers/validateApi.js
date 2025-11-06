/* eslint-disable no-console */
/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const helper = require('./helper');

const { JWT_SECRET_TOKEN } = process.env;

module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).json(helper.errorResponse([], 403, 'No credentials sent!'));
  }

  let token = req.headers.authorization;
  token = token.replace('Bearer ', '').trim();
  jwt.verify(token, JWT_SECRET_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(401).json(helper.errorResponse([], 401, 'Failed to authenticate token!'));
    }

    req.datajwt = decoded;
    next();
  });
};
