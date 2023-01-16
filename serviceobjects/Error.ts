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

export class BaseError extends Error {
    public readonly name: string;
    public readonly httpCode: HttpStatusCode;
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
        this.httpCode = httpCode;
        this.userMessage = userMessage;
        this.isOperational = isOperational;

        Error.captureStackTrace(this);
    }
}

//free to extend the BaseError
export class APIError extends BaseError {
    constructor(
        name: string,
        httpCode = HttpStatusCode.INTERNAL_SERVER,
        description = "internal server error",
        userMessage = "There is some error in service",
        isOperational = true
    ) {
        super(name, httpCode, description, userMessage, isOperational);
    }
}