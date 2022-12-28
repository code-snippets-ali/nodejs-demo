import { APIError } from "../serviceobjects/Error";
import { NextFunction, Request, Response } from "express";

module.exports = function (
    error: APIError,
    req: Request,
    res: Response,
    next: NextFunction
) {
    res.status(error.httpCode).send(error.userMessage);
};
