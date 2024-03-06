const logger = require('../../logger/index');
class customError extends Error {
  constructor(errorName,errorMessage) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(errorName,errorMessage)
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, customError)
    }
      this.name = errorName;
      // Custom debugging information
      logger.info(JSON.stringify(errorMessage.stack));
      this.errorMessage = errorMessage;
    }
    
 
}
module.exports = customError;