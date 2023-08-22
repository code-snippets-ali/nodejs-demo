import { NextFunction, Request, Response } from "express";
import { APIError } from "../serviceobjects/APIError";
import { HttpStatusCode } from "../serviceobjects/enums/HttpStatusCode";

const unhandledRoute = function (
    req: Request,
    res: Response,
    next: NextFunction
) {
    const apiError = new APIError(
        "URL not found",
        HttpStatusCode.NOT_FOUND,
        "Unhandled URL Error",
        `Following URL is not found ${req.baseUrl + req.originalUrl}`,
        false
    );
    next(apiError);
};

module.exports = unhandledRoute;
