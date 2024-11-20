import { NextFunction, Request, Response } from "express";
import { APIError } from "../serviceobjects/APIError";
import { HttpStatusCode } from "../serviceobjects/enums/HttpStatusCode";

import { appConfig, Settings } from "../serviceobjects/Utilities/Settings";

const unhandledRoute = function (
    req: Request,
    res: Response,
    next: NextFunction
) {
    const apiError = new APIError(
        "URL not found",
        HttpStatusCode.NOT_FOUND,
        "Unhandled URL Error",
        `Following URL is not found ${
            req.baseUrl + req.originalUrl
        } at ${appConfig(Settings.Name)}`,
        false
    );
    next(apiError);
};

module.exports = unhandledRoute;
