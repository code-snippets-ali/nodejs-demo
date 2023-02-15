import { Logger } from "winston";

const winston = require("winston");
const { appConfig, Settings } = require("./Settings");
require("winston-mongodb");

class LoggerService {
    logger: Logger;
    constructor() {
        this.logger = winston.createLogger({
            level: "error",
            format: winston.format.json(),
            defaultMeta: { service: "user-service" },
            transports: [
                //
                // - Write all logs with importance level of `error` or less to `error.log`
                // - Write all logs with importance level of `info` or less to `combined.log`
                //
                new winston.transports.File({
                    filename: "error.log",
                    level: "error",
                }),
                new winston.transports.File({ filename: "combined.log" }),
                new winston.transports.MongoDB({
                    db: appConfig(Settings.DBString),
                }),
            ],
        });

        this.logger.add(
            new winston.transports.Console({
                format: winston.format.simple(),
            })
        );
    }
}
const service = new LoggerService();
export const logger = service.logger;