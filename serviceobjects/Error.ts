export class ResultError {
    statusCode: Number;
    message: String;
    constructor(statusCode: Number, message: String) {
        this.message = message;
        this.statusCode = statusCode;
    }
}
