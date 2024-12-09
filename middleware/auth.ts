import { NextFunction, Request, Response } from "express";
import { appConfig, Settings } from "../serviceobjects/Utilities/Settings";
import { HttpStatusCode } from "../serviceobjects/enums/HttpStatusCode";
import { APIError } from "../core-sdk/APIError";
import { Role } from "../serviceobjects/enums/Role";
import { UserService } from "../serviceobjects/userServices";
import { Common } from "../serviceobjects/Utilities/Common";
import { AuthenticationService } from "../serviceobjects/authenticationService";
import {
    IRefreshUserClient,
    ISignedInUserClient,
} from "../serviceobjects/interfaces/ISignedInUserClient";
import { IRefreshTokenRequest } from "../core-sdk/contracts/auhentication/RefreshTokenRequest";
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

export async function auth(req: Request, res: Response, next: NextFunction) {
    //#region 1. Check If user has provided token
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization?.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        const apiError = new APIError(
            "Access Token Not Provided",
            HttpStatusCode.UNAUTHORIZED,
            "",
            "Access denied. Please provide an access token"
        );
        next(apiError);
        return;
    }
    //#endregion

    try {
        //#region 2. Check if provided token is a valid token
        const decoded = await new AuthenticationService().verifyToken(token);
        //#endregion
        //#region 3. Test if user is account is still active and Have valid passwod
        await new UserService().isActiveUserWithSamePassword(
            decoded._id,
            decoded.iat
        );
        //#endregion
        const signedInUser: ISignedInUserClient = {
            _id: decoded._id,
            access_levels: decoded.access_levels,
            iat: decoded.iat,
        };
        req.body.signedInUser = signedInUser;
        next();
    } catch (ex: any) {
        //#region Errors if something has gone wrong
        const name = ex.name ?? "";
        let message = "";
        switch (name) {
            case "TokenExpiredError":
                message = "Your token has expired.";
                break;
            case "JsonWebTokenError":
                message = "The token you've provided appears to be invalid.";
                break;
            default:
                next(ex);
                return;
        }
        const apiError = new APIError(
            "Invalid Access Token",
            HttpStatusCode.BAD_REQUEST,
            "",
            message
        );
        next(apiError);
        //#endregion
    }
}

function requiredAccess(...accessLevels: [Role]) {
    return (req: Request, res: Response, next: Function) => {
        let requestObject = req as any;
        if (
            !Common.hasCommonValue(
                accessLevels,
                requestObject.user.access_levels
            )
        ) {
            const apiError = new APIError(
                "Invalid Access Token",
                HttpStatusCode.FORBIDDEN,
                "",
                "You donot have permission for this action"
            );
            next(apiError);
            return;
        }
        next();
    };
}

function requiredHigherAccessThan(accessLevel: Role) {
    return (req: Request, res: Response, next: Function) => {
        let requestObject = req as any;
        if (accessLevel >= requestObject.user.access_level) {
            const apiError = new APIError(
                "Invalid Access Token",
                HttpStatusCode.FORBIDDEN,
                "",
                "You donot have permission for this action"
            );
            next(apiError);
            return;
        }
        next();
    };
}

async function refresh(req: Request, res: Response, next: Function) {
    const params: IRefreshTokenRequest = req.body.params;

    try {
        const decoded = jwt.verify(
            params.refreshToken,
            appConfig(Settings.JWTPrivateKey)
        );
        const refreshUser: IRefreshUserClient = {
            _id: decoded._id,
            iat: decoded.iat,
        };
        req.body.refreshUser = refreshUser;
        await new UserService().isActiveUserWithSamePassword(
            decoded._id,
            decoded.iat
        );
        next();
    } catch (ex: any) {
        const name = ex.name ?? "";
        let message = "";
        switch (name) {
            case "TokenExpiredError":
                message = "Your token has expired.";
                break;
            case "JsonWebTokenError":
                message = "The token you've provided appears to be invalid.";
                break;
            default:
                next(ex);
                return;
        }
        const apiError = new APIError(
            "Invalid Access Token",
            HttpStatusCode.UNAUTHORIZED,
            "",
            message
        );
        next(apiError);
    }
}

async function forgotPassword(req: Request, res: Response, next: Function) {}

async function resetPassword(req: Request, res: Response, next: Function) {}

// module.exports.auth = auth;
module.exports.requiredAccess = requiredAccess;
module.exports.requiredHigherAccess = requiredHigherAccessThan;

module.exports.refresh = refresh;

module.exports.forgotPassword = forgotPassword;
module.exports.resetPassword = resetPassword;
