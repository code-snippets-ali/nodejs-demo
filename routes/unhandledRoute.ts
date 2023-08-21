import { NextFunction, Request, Response } from "express";
import { APIError, HttpStatusCode } from "../serviceobjects/Error";

const unhandledRoute = function (
    req: Request,
    res: Response,
    next: NextFunction
) {
    const apiError = new APIError(
        "URL not found",
        HttpStatusCode.NOT_FOUND,
        `Following URL is not found ${req.baseUrl + req.originalUrl}`,
        "",
        false
    );
    next(apiError);
};

module.exports = unhandledRoute;
