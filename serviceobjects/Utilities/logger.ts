import winston, { Logger, transports, format } from "winston";
import "winston-mongodb"; // Import the MongoDB transport
import { appConfig, Settings } from "./Settings";
import { HttpStatusCode } from "../enums/HttpStatusCode";

export class LoggerService {
    private logger: Logger;
    constructor(mongoUri: string, collectionName: string = "logs") {
        // Custom filter to restrict logs to a specific level
        const levelFilter = (level: string) => {
            return winston.format((info) => {
                return info.level === level ? info : false;
            })();
        };
        this.logger = winston.createLogger({
            level: "debug", // The lowest level to log (captures all levels)
            format: format.combine(
                format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
                format.errors({ stack: true }),
                format.json()
            ),
            transports: [
                new transports.File({
                    filename: "error.log",
                    format: winston.format.combine(
                        levelFilter("error"), // Only log errors
                        winston.format.json()
                    ),
                }),
                new transports.File({
                    filename: "warn.log",
                    format: winston.format.combine(
                        levelFilter("warn"), // Only log warn
                        winston.format.json()
                    ),
                }),
                new transports.File({
                    filename: "info.log",
                    format: winston.format.combine(
                        levelFilter("info"), // Only log info
                        winston.format.json()
                    ),
                }),
                new transports.File({
                    filename: "debug.log",
                    format: winston.format.combine(
                        levelFilter("debug"), // Only log debug
                        winston.format.json()
                    ),
                }),
                new transports.MongoDB({
                    db: mongoUri,
                    collection: collectionName,
                    level: "warn", // Logs `error` level and above to MongoDB
                    format: format.combine(format.timestamp(), format.json()),
                }),
            ],
        });

        // Log to console in development
        if (process.env.NODE_ENV !== "production") {
            this.logger.add(
                new transports.Console({
                    format: format.combine(format.colorize(), format.simple()),
                })
            );
        }
    }

    public error(message: string, meta?: any): void {
        this.logger.error(message, meta);
    }

    public warn(message: string, meta?: any): void {
        this.logger.warn(message, meta);
    }

    public info(message: string, meta?: any): void {
        this.logger.info(message, meta);
    }

    public debug(message: string, meta?: any): void {
        this.logger.debug(message, meta);
    }

    public log(level: string, message: string, meta?: any): void {
        this.logger.log(level, message, meta);
    }

    public smartLog(message: string, status: number, meta?: any): void {
        if (status >= HttpStatusCode.INTERNAL_SERVER) {
            this.error(message, meta);
        } else if (
            status == HttpStatusCode.BAD_REQUEST ||
            status == HttpStatusCode.NOT_FOUND
        ) {
            this.info(message, meta);
        } else if (status == HttpStatusCode.UNAUTHORIZED) {
            this.warn(message, meta);
        } else {
            this.debug(message, meta);
        }
    }
}
export const logger = new LoggerService(appConfig(Settings.DBString));
