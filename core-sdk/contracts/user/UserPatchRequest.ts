import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { zodErrorResponse } from "../zodErrorResponse";
import { HttpStatusCode } from "../../../serviceobjects/enums/HttpStatusCode";
import { APIError } from "../../APIError";

export const UserPatchRequestSchema = z.object({
    name: z
        .string()
        .min(1, "Name is required")
        .max(50, "Name must be at most 50 characters long")
        .optional(),
    email: z
        .string()
        .min(1, "Email is required")
        .max(100, "Email must be at most 100 characters long")
        .email("Invalid email address")
        .optional(),
    isActive: z.boolean().optional(),
});

export type IUserPatchRequest = z.infer<typeof UserPatchRequestSchema>;

export function validateUserPatchRequest(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        req.body.params = UserPatchRequestSchema.parse(req.body);
        const { name, email, isActive } = req.body;
        if (!name && !email && isActive === undefined) {
            throw new APIError(
                "Invalid Request",
                HttpStatusCode.BAD_REQUEST,
                "",
                "At least one field must be provided"
            );
        }
        next();
    } catch (e) {
        if (e instanceof z.ZodError) {
            throw zodErrorResponse(e.errors);
        } else if (e instanceof APIError) {
            throw e;
        } else {
            res.status(400).json({ error: "Unknown error" });
        }
    }
}
