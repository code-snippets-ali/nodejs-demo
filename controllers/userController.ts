import { NextFunction, Request, Response } from "express";
import { UserService } from "../serviceobjects/UserService";

export async function getProfile(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const service = new UserService();
    const profile = await service.me(req.body.user._id);
    res.send(profile);
}

export async function updateProfile(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const service = new UserService();
    let result = await service.updateProfile(req.body);
    if (result.success) {
        res.status(result.statusCode).send();
    } else {
        res.status(result.statusCode).send(result);
    }
}
