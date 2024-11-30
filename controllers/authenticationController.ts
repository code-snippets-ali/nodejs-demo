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

    res.status(authentication.statusCode)
        .header("x-auth-token", authentication.accessToken ?? "")
        .send(authentication);
}

export async function signin(req: Request, res: Response, next: NextFunction) {
    const authentication: IAuthenticationResponse = await service.signIn(
        req.body.params
    );
    res.status(authentication.statusCode)
        .header("x-auth-token", authentication.accessToken ?? "")
        .send(authentication);
}
// This is comments
export async function token(req: Request, res: Response, next: NextFunction) {
    const authentication: IAuthenticationResponse = await service.refreshToken(
        req.body.user
    );
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

    const service = new AuthenticationService();
    const resetURL = `${req.protocol}://${req.get("host")}/api/v1`;
    const response = await service.forgotPassword(req.body.email, resetURL);
    res.status(response.statusCode).send(response);
}

export async function resetPassword(
    req: Request,
    res: Response,
    next: NextFunction
) {}
