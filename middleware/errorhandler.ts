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
    logger.error(error.message, [req.body, req.url, req.query, req.params]);
    console.log(req.body);
    console.log(error.message);
};
