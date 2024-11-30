//https://www.toptal.com/nodejs/node-js-error-handling
import { HttpStatusCode } from "../serviceobjects/enums/HttpStatusCode";
export class ResultError {
    statusCode: Number;
    message: String;
    constructor(statusCode: Number, message: String) {
        this.message = message;
        this.statusCode = statusCode;
    }
}

export class AppError extends Error {
    public readonly name: string;
    public readonly statusCode: HttpStatusCode;
    public readonly userMessage: string;
    public readonly isOperational: boolean;

    constructor(
        name: string,
        httpCode: HttpStatusCode,
        description: string,
        userMessage: string,
        isOperational: boolean
    ) {
        super(userMessage);
        Object.setPrototypeOf(this, new.target.prototype);

        this.name = name;
        this.statusCode = httpCode;
        this.userMessage = userMessage;
        this.isOperational = isOperational;

        Error.captureStackTrace(this);
    }
}

//free to extend the BaseError
export class APIError extends AppError {
    public readonly errors?: any;
    constructor(
        name: string,
        statusCode = HttpStatusCode.INTERNAL_SERVER,
        description = "internal server error",
        userMessage = "There is some error in service",
        errors?: any,
        isOperational = true
    ) {
        super(name, statusCode, description, userMessage, isOperational);
        this.errors = errors;
    }
}
