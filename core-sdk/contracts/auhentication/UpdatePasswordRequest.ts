import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { zodErrorResponse } from "../zodErrorResponse";

export const UpdatePasswordRequestSchema = z
    .object({
        currentPassword: z
            .string()
            .min(6, "Password must be at least 6 characters long"),
        newPassword: z
            .string()
            .min(6, "Password must be at least 6 characters long"),
        confirmNewPassword: z
            .string()
            .min(6, "Password must be at least 6 characters long"),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"], // Error will be attached to confirmPassword field
    });

export type IUpdatePasswordRequest = z.infer<
    typeof UpdatePasswordRequestSchema
>;

export function validateUpdatePasswordRequest(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        req.body.params = UpdatePasswordRequestSchema.parse(req.body);
        next();
    } catch (e) {
        if (e instanceof z.ZodError) {
            throw zodErrorResponse(e.errors);
        } else {
            res.status(400).json({ error: "Unknown error" });
        }
    }
}
