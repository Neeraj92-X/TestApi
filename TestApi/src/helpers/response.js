const logger = require('../../logger/index');
const eventLogger = require('../../logger/eventLogger');

module.exports = class Helper {
    static async cResponse(req, res, status, info, data = null) { // Add 'async' here
        // Generating custom error messages for logger
        if (info.stack) {
            let customMsg;
            if (info.errorMessage) {
                customMsg = info.errorMessage;
                info = info.name;
            } else {
                customMsg = info.stack;
                info = info.message;
            }
            logger.info(JSON.stringify(customMsg));
        }
        let userId = req.token ? req.token.userId : "";
        let responseObj = {
            status: status,
            message: info
        }
        if (data != null) {
            Object.assign(responseObj, { data: data })
        }

        eventLogger.info(`\n${req.method} ${req.url} ${userId} {${status} ${info}}\n`)
        res.status(status).json(responseObj);
    }
};