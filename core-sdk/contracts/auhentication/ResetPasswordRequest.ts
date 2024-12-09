import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { zodErrorResponse } from "../zodErrorResponse";

export const ResetPasswordRequestSchema = z
    .object({
        token: z.string().min(1, "Token is required"),
        changedPassword: z
            .string()
            .min(1, "Password must be at least 6 characters long"),
        confirmPassword: z
            .string()
            .min(6, "Password must be at least 6 characters long"),
    })
    .refine((data) => data.changedPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"], // Error will be attached to confirmPassword field
    });

export type IResetPasswordRequest = z.infer<typeof ResetPasswordRequestSchema>;

export function validateResetPasswordRequest(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        req.body.params = ResetPasswordRequestSchema.parse(req.body);
        next();
    } catch (e) {
        if (e instanceof z.ZodError) {
            throw zodErrorResponse(e.errors);
        } else {
            res.status(400).json({ error: "Unknown error" });
        }
    }
}
