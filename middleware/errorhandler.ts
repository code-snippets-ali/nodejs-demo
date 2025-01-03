import { NextFunction, Request, Response } from "express";
import { logger } from "../serviceobjects/Utilities/logger";
import { APIError } from "../core-sdk/APIError";
import { HttpStatusCode } from "../serviceobjects/enums/HttpStatusCode";

module.exports = function (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    let statusCode = HttpStatusCode.INTERNAL_SERVER;
    let message =
        "There is some issue in our service. Please try later or contact support";
    let apiError: APIError | undefined;

    if (error instanceof APIError) {
        apiError = error;
    } else if (error.name === "CastError") {
        apiError = handleCastError(error);
    } else if ((error as any).code == 11000) {
        apiError = handleDuplicateDBField(error);
    } else if (error.name === "ValidationError") {
        apiError = handleValidationErrorDB(error);
    }

    if (apiError) {
        statusCode = apiError.statusCode;
        message = apiError.message;
        logger.smartLog(error.message, statusCode, {
            details: {
                statusCode: statusCode,
                Type: "API Error",
                Body: req.body,
                URL: req.url,
                Query: req.query,
                Parameters: req.params,
                Method: req.method,
            },
        });
    } else {
        logger.smartLog(error.message, statusCode, {
            details: {
                statusCode: statusCode,
                Type: "Handled UnExpected Exception",
                Body: req.body,
                URL: req.url,
                Query: req.query,
                Parameters: req.params,
                Method: req.method,
            },
        });
    }
    // console.log(`Environment is ${process.env.NODE_ENV}`);
    if (process.env.NODE_ENV == "development") {
        sendErrorDevelopment(
            error,
            req,
            res,
            statusCode,
            message,
            apiError?.errors
        );
    } else {
        sendErrorProduction(
            error,
            req,
            res,
            statusCode,
            message,
            apiError?.errors
        );
    }
};

function sendErrorDevelopment(
    error: Error,
    req: Request,
    res: Response,
    statusCode: HttpStatusCode,
    message: string,
    errors?: any
) {
    res.status(statusCode).send({
        success: false,
        statusCode: statusCode,
        message: message,
        error: error,
        errors: errors,
        stack: error.stack,
    });
}

function sendErrorProduction(
    error: Error,
    req: Request,
    res: Response,
    statusCode: HttpStatusCode,
    message: string,
    errors?: any
) {
    res.status(statusCode).send({
        success: false,
        statusCode: statusCode,
        message: message,
        errors,
    });
}

function handleCastError(error: any): APIError {
    const message = `Invalid ${error.path}: ${error.value}`;
    return new APIError(
        "Invalid Cast",
        HttpStatusCode.BAD_REQUEST,
        message,
        message,
        true
    );
}

function handleDuplicateDBField(error: any) {
    const message = `Following fields have duplicated values that already exist in the collection: { ${Object.keys(
        error.keyValue
    ).join(",")} }`;

    return new APIError(
        "Duplicate Unique key",
        HttpStatusCode.BAD_REQUEST,
        message,
        message,
        true
    );
}

function handleValidationErrorDB(error: any) {
    const validationErrors = Object.values(error.errors).map(
        (e) => (e as any).message
    );

    const message = `Invalid input data: ${validationErrors.join(",")}`;
    return new APIError(
        "Validation Eerror",
        HttpStatusCode.BAD_REQUEST,
        message,
        message,
        true
    );
}
