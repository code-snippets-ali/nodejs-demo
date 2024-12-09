import { NextFunction, Request, Response } from "express";
import { AuthenticationService } from "../serviceobjects/authenticationService";
import { IAuthenticationResponse } from "../core-sdk/contracts/auhentication/AuthenticationResponse";
const service = new AuthenticationService();

export async function register(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authentication: IAuthenticationResponse = await service.registerUser(
        req.body
    );
    attachCookie(res, authentication);
    res.status(authentication.statusCode)
        .header("x-auth-token", authentication.accessToken ?? "")
        .send(authentication);
}

export async function signin(req: Request, res: Response, next: NextFunction) {
    const authentication: IAuthenticationResponse = await service.signIn(
        req.body.params
    );
    attachCookie(res, authentication);
    res.status(authentication.statusCode)
        .header("x-auth-token", authentication.accessToken ?? "")
        .send(authentication);
}

export async function refreshToken(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authentication: IAuthenticationResponse = await service.refreshToken(
        req.body.params,
        req.body.refreshUser
    );
    attachCookie(res, authentication);
    res.header("x-auth-token", authentication.accessToken ?? "").send(
        authentication
    );
}

export async function forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Get the user based on Email address
    const resetURL = `${req.protocol}://${req.get("host")}/api`;
    const response = await service.forgotPassword(req.body.params, resetURL);
    res.status(response.statusCode).send(response);
}

export async function resetPassword(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const response = await service.resetPassword(req.body.params);
    res.status(response.statusCode).send(response);
}

export async function updatePassword(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const response = await service.updatePassword(
        req.body.params,
        req.body.signedInUser
    );
    res.status(response.statusCode).send(response);
}

function attachCookie(res: Response, authentication: IAuthenticationResponse) {
    res.cookie("x-auth-token", authentication.accessToken ?? "", {
        expires: new Date(Date.now() + 8 * 60 * 60 * 1000), //8hrs
        secure: true,
        httpOnly: true,
    });
    res.cookie("x-auth-refresh-token", authentication.refreshToken ?? "", {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), //30days
        secure: true,
        httpOnly: true,
    });
}
