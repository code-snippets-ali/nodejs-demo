import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { zodErrorResponse } from "../zodErrorResponse";

export const RefreshTokenRequestSchema = z.object({
    refreshToken: z.string().min(1, "Token is required"),
});

export type IRefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;

export function validateRefreshTokenRequest(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        req.body.params = RefreshTokenRequestSchema.parse(req.body);
        next();
    } catch (e) {
        if (e instanceof z.ZodError) {
            throw zodErrorResponse(e.errors);
        } else {
            res.status(400).json({ error: "Unknown error" });
        }
    }
}
