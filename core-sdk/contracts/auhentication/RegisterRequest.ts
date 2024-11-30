import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { zodErrorResponse } from "../zodErrorResponse";

export const RegisterRequestSchema = z.object({
    name: z
        .string()
        .min(1, "Name is required")
        .max(50, "Name must be at most 50 characters long"),
    email: z
        .string()
        .min(1, "Email is required")
        .max(100, "Email must be at most 100 characters long")
        .email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type IRegisterRequest = z.infer<typeof RegisterRequestSchema>;

export function validateRegisterRequest(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        req.body.params = RegisterRequestSchema.parse(req.body);
        next();
    } catch (e) {
        if (e instanceof z.ZodError) {
            throw zodErrorResponse(e.errors);
        } else {
            res.status(400).json({ error: "Unknown error" });
        }
    }
}
