import { NextFunction, Request, Response } from "express";
import { IResponse } from "../serviceobjects/Interfaces/IResponse";
import { AuthenticationService } from "../serviceobjects/authenticationService";

export interface IAuthenticationResponse extends IResponse {
    accessToken?: string;
    refreshToken?: String;
    expiresIn?: String;
}

export async function register(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const service = new AuthenticationService();
        const authentication: IAuthenticationResponse =
            await service.registerUser(req.body);

        res.status(authentication.statusCode)
            .header("x-auth-token", authentication.accessToken ?? "")
            .send(authentication);
    } catch (ex: any) {
        next(ex);
    }
}

export async function signin(req: Request, res: Response, next: NextFunction) {
    try {
        const service = new AuthenticationService();
        const authentication: IAuthenticationResponse = await service.signIn(
            req.body
        );
        res.status(authentication.statusCode)
            .header("x-auth-token", authentication.accessToken ?? "")
            .send(authentication);
    } catch (ex: any) {
        next(ex);
    }
}
// This is comments
export async function token(req: Request, res: Response, next: NextFunction) {
    try {
        const service = new AuthenticationService();
        const authentication: IAuthenticationResponse =
            await service.refreshToken(req.body.user);
        res.header("x-auth-token", authentication.accessToken ?? "").send(
            authentication
        );
    } catch (ex: any) {
        next(ex);
    }
}

export async function forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Get the user based on Email address
    try {
        const service = new AuthenticationService();
        const response = await service.forgotPassword(req.body.email);
        res.status(response.statusCode).send(response);
    } catch (ex: any) {
        next(ex);
    }

    //Generate the random reset token
    //Send it to user email address.
}
