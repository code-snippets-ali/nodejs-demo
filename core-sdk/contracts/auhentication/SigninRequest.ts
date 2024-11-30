import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { zodErrorResponse } from "../zodErrorResponse";

export const SignInRequestSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .max(100, "Email must be at most 100 characters long")
        .email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type ISignInRequest = z.infer<typeof SignInRequestSchema>;

export function validateSignInRequest(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        req.body.params = SignInRequestSchema.parse(req.body);
        next();
    } catch (e) {
        if (e instanceof z.ZodError) {
            throw zodErrorResponse(e.errors);
        } else {
            res.status(400).json({ error: "Unknown error" });
        }
    }
}
