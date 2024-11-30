import { NextFunction, Request, Response } from "express";
import { UserService } from "../serviceobjects/userService";

const service = new UserService();

export async function getProfile(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const profile = await service.me(req.body.user._id);
    res.send(profile);
}

export async function updateUser(
    req: Request,
    res: Response,
    next: NextFunction
) {
    let result = await service.updateProfile(
        req.body.params,
        req.body.user._id
    );
    res.send(result);
}
