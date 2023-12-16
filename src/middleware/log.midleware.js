const { logEvents } = require('../helpers/logger');

const logHandler = (req, res, next) => {
  const message = `${req.method}\t${req.url}\t${req.headers.origin}`;
  logEvents(message, 'reqLog.log');
  console.log(`${req.method} ${req.path}`);
  next();
};

module.exports = { logHandler };
