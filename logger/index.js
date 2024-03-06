const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");

const myformat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.printf(info => `${info.timestamp} :${info.level}: ${info.message}`)
);
const transport = new DailyRotateFile({
    filename: 'logs/%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: false,
    maxSize: '20m',
    maxFiles: '14d',
    prepend: true,
});

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.json(),
        winston.format.align(),
        winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [
        transport
    ],
});
module.exports = logger;