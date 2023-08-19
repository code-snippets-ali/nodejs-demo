import { NextFunction, Request, Response } from "express";
import { logger } from "../serviceobjects/Utilities/logger";
import { APIError } from "../serviceobjects/Error";

module.exports = function (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (error instanceof APIError) {
        res.status(error.statusCode).send({
            success: false,
            message: error.message,
        });
    } else {
        res.status(500).send({
            success: false,
            message:
                "There is some issue in our service. Please try later or contact support",
        });
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
