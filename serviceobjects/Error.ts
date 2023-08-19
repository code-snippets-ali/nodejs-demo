//https://www.toptal.com/nodejs/node-js-error-handling

export enum HttpStatusCode {
    OK = 200,
    CREATED = 201,
    UPDATED = 204,
    UNAUTHORIZED = 401,
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
    INTERNAL_SERVER = 500,
}

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
        super(description);
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
    constructor(
        name: string,
        statusCode = HttpStatusCode.INTERNAL_SERVER,
        description = "internal server error",
        userMessage = "There is some error in service",
        isOperational = true
    ) {
        super(name, statusCode, description, userMessage, isOperational);
    }
}
