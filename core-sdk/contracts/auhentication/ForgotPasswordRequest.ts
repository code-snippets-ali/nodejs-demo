import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { zodErrorResponse } from "../zodErrorResponse";

export const ForgotPasswordRequestSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .max(100, "Email must be at most 100 characters long")
        .email("Invalid email address"),
});

export type IForgotPasswordRequest = z.infer<
    typeof ForgotPasswordRequestSchema
>;

export function validateForgotPasswordRequest(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        req.body.params = ForgotPasswordRequestSchema.parse(req.body);
        next();
    } catch (e) {
        if (e instanceof z.ZodError) {
            throw zodErrorResponse(e.errors);
        } else {
            res.status(400).json({ error: "Unknown error" });
        }
    }
}
