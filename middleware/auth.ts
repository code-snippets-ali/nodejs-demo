import { Request, Response } from "express";
import { HttpStatusCode } from "../serviceobjects/Error";
const jwt = require("jsonwebtoken");
const config = require("config");
const { get } = require("config");

function auth(req: Request, res: Response, next: Function) {
    const token = req.header("x-auth-token");
    if (!token) {
    }
    return res.status(HttpStatusCode.BAD_REQUEST).send({
        success: false,
        message: "Access denied. Please provide an access token",
    });
    try {
        const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
        req.body.user = decoded;
        next();
    } catch (ex) {
        console.log(ex);
        res.status(HttpStatusCode.UNAUTHORIZED).send("Invalid token");
    }
}

function admin(req: Request, res: Response, next: Function) {
    if (!req.body.user.isAdmin) {
        return res.status(HttpStatusCode.UNAUTHORIZED).send({
            success: false,
            message: "Access denied. You are not authorized to access this api",
            statusCode: HttpStatusCode.UNAUTHORIZED,
        });
    }
    next();
}

function refresh(req: Request, res: Response, next: Function) {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        return res.status(HttpStatusCode.BAD_REQUEST).send({
            success: false,
            message:
                "Access denied. Please provide the refresh token to proceed",
            statusCode: HttpStatusCode.BAD_REQUEST,
        });
    }

    try {
        const decoded = jwt.verify(refreshToken, config.get("jwtPrivateKey"));
        req.body.user = decoded;
        next();
    } catch (ex) {
        console.log(ex);
        res.status(HttpStatusCode.BAD_REQUEST).send({
            success: false,
            message: "Access denied. Refresh token is invalid",
            statusCode: HttpStatusCode.BAD_REQUEST,
        });
    }
}

module.exports.auth = auth;
module.exports.admin = admin;
module.exports.refresh = refresh;
