import { ZodIssue } from "zod";
import { APIError } from "../APIError";
import { HttpStatusCode } from "../../serviceobjects/enums/HttpStatusCode";

export function zodErrorResponse(issues: ZodIssue[]): APIError {
    const errors = issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
    }));

    return new APIError(
        "Validation error",
        HttpStatusCode.BAD_REQUEST,
        "Validation error Occured",
        "Validation error for User",
        errors,
        true
    );
}
