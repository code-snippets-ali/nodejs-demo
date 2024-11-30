import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { zodErrorResponse } from "../zodErrorResponse";
import { HttpStatusCode } from "../../../serviceobjects/enums/HttpStatusCode";
import { APIError } from "../../APIError";

export const UserPutRequestSchema = z.object({
    name: z
        .string()
        .min(1, "Name is required")
        .max(50, "Name must be at most 50 characters long"),
    email: z
        .string()
        .min(1, "Email is required")
        .max(100, "Email must be at most 100 characters long")
        .email("Invalid email address"),
    isActive: z.boolean(),
});

export type IUserPutRequest = z.infer<typeof UserPutRequestSchema>;

export function validateUserPutRequest(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        req.body.params = UserPutRequestSchema.parse(req.body);
        next();
    } catch (e) {
        if (e instanceof z.ZodError) {
            throw zodErrorResponse(e.errors);
        } else {
            res.status(400).json({ error: "Unknown error" });
        }
    }
}
