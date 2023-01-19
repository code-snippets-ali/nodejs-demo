import { APIError } from "../serviceobjects/Error";
import { NextFunction, Request, Response } from "express";
import logger from "../serviceobjects/Utilities/logger";

module.exports = function (
    error: APIError,
    req: Request,
    res: Response,
    next: NextFunction
) {
    res.status(500).send({
        success: false,
        message:
            "There is some issue in our service. Please try later or contact support",
    });
    // logger.info(error.message, [req.body, req.url, req.query, req.params]);
    logger.error(error.message, {
        metadata: {
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
