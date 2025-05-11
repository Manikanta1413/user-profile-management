const winston = require("winston");
require("winston-daily-rotate-file");
const path = require("path");

// Define log directory and format
const logDirectory = path.join(__dirname, "..", "logs");

const logFormat = winston.format.printf(
  ({ timestamp, level, message, stack }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
  }
);

// Console colors
winston.addColors({
  error: "red",
  warn: "yellow",
  info: "green",
  http: "cyan",
  debug: "blue",
});

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    logFormat
  ),
  transports: [
    new winston.transports.DailyRotateFile({
      filename: "application-%DATE%.log",
      dirname: logDirectory,
      datePattern: "YYYY-MM-DD",
      zippedArchive: false,
      maxSize: "5m",
      maxFiles: "14d",
      level: "info",
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.simple()
      ),
    }),
  ],
});

module.exports = logger;
