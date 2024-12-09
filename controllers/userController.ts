import { NextFunction, Request, Response } from "express";
import { UserService } from "../serviceobjects/userServices";

const service = new UserService();

export async function getProfile(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const profile = await service.me(req.body.signedInUser);
    res.send(profile);
}

export async function updateUser(
    req: Request,
    res: Response,
    next: NextFunction
) {
    let result = await service.updateProfile(
        req.body.params,
        req.body.signedInUser
    );
    res.send(result);
}
