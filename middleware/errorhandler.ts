import { NextFunction, Request, Response } from "express";
import { logger } from "../serviceobjects/Utilities/logger";
import { APIError, HttpStatusCode } from "../serviceobjects/Error";

module.exports = function (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    let statusCode = HttpStatusCode.INTERNAL_SERVER;
    let message =
        "There is some issue in our service. Please try later or contact support";

    if (error instanceof APIError) {
        statusCode = error.statusCode;
        message = error.message;
    }
    console.log(`ENvironment is ${process.env.NODE_ENV}`);
    if (process.env.NODE_ENV == "development") {
        sendErrorDevelopment(error, req, res, statusCode, message);
    } else {
        sendErrorProduction(error, req, res, statusCode, message);
    }
    // logger.info(error.message, [req.body, req.url, req.query, req.params]);

    logger.error(error.message, {
        metadata: {
            Type: "Handled Exception",
            Body: req.body,
            URL: req.url,
            Query: req.query,
            Parameters: req.params,
            Method: req.method,
        },
    });
    console.log(req.body);
    console.log(error.message);
};

const sendErrorDevelopment = (
    error: Error,
    req: Request,
    res: Response,
    statusCode: HttpStatusCode,
    message: string
) => {
    res.status(statusCode).send({
        success: false,
        message: error.message,
        error: error,
        stack: error.stack,
    });
};

const sendErrorProduction = (
    error: Error,
    req: Request,
    res: Response,
    statusCode: HttpStatusCode,
    message: string
) => {
    res.status(statusCode).send({
        success: false,
        message: message,
    });
};
