const helpers = require('../helpers/index');
const eventLogger = require('../../logger/index');
module.exports = async (req, res, next) => {
  //validating request parameters
  eventLogger.info([
    '\n',
    req.method,
    req.url,
    JSON.stringify(req.body)
  ].join(' '));
  req.body = helpers.CM.trimBody(req.body);
  next();
}