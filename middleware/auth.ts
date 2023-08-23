import { Request, Response } from "express";
import { appConfig, Settings } from "../serviceobjects/Utilities/Settings";
import { HttpStatusCode } from "../serviceobjects/enums/HttpStatusCode";
import { APIError } from "../serviceobjects/APIError";
import { AccessLevel } from "../serviceobjects/enums/AccessLevel";
import { UserService } from "../serviceobjects/UserService";
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

export async function auth(req: Request, res: Response, next: Function) {
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
    try {
        const decoded = await promisify(jwt.verify)(
            token,
            appConfig(Settings.JWTPrivateKey)
        );
        const id = decoded._id;
        const service = new UserService();
        console.log(`decoded = ${JSON.stringify(decoded)}`);
        const isActive = await service.isActiveUser(id);

        if (!isActive) {
            throw new APIError(
                "No Active User",
                HttpStatusCode.UNAUTHORIZED,
                "",
                "This user no longer has an active account"
            );
        }
        req.body.user = decoded;
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

function admin(req: Request, res: Response, next: Function) {
    if (req.body.user.access_level !== AccessLevel.Admin) {
        throw new APIError(
            "Token Access is not Admin",
            HttpStatusCode.UNAUTHORIZED,
            "",
            "Access denied. You are not authorized to access this api"
        );
    }
    next();
}

function atleastAdmin(req: Request, res: Response, next: Function) {
    if (req.body.user.access_level > AccessLevel.Admin) {
        throw new APIError(
            "Token Access is not Admin",
            HttpStatusCode.UNAUTHORIZED,
            "",
            "Access denied. You are not authorized to access this api"
        );
    }
    next();
}

function refresh(req: Request, res: Response, next: Function) {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        throw new APIError(
            "Refresh Token Not Provided",
            HttpStatusCode.BAD_REQUEST,
            "",
            "Access denied. Please provide the refresh token to proceed"
        );
    }

    try {
        const decoded = jwt.verify(
            refreshToken,
            appConfig(Settings.JWTPrivateKey)
        );
        req.body.user = decoded;
        next();
    } catch (ex) {
        throw new APIError(
            "Refresh Token Not Provided",
            HttpStatusCode.UNAUTHORIZED,
            "",
            "Access denied. Refresh token is invalid"
        );
    }
}

// module.exports.auth = auth;
module.exports.admin = admin;
module.exports.refresh = refresh;
