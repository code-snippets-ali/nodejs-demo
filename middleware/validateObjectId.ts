import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export function validateObjectId(
    req: Request,
    res: Response,
    next: NextFunction
) {
    mongoose.Types.ObjectId.isValid(req.params.id)
        ? next()
        : res.status(400).send("Invalid ID");
}
