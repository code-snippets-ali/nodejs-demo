import { Request, Response } from "express";
const jwt = require("jsonwebtoken");
const config = require("config");
const { get } = require("config");

function auth(req: Request, res: Response, next: Function) {
    const token = req.header("x-auth-token");
    if (!token) return res.status(400).send("Access denied. No token provided");
    try {
        const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
        req.body.user = decoded;
        next();
    } catch (ex) {
        console.log(ex);
        res.status(401).send("Invalid token");
    }
}

function admin(req: Request, res: Response, next: Function) {
    if (!req.body.user.isAdmin) return res.status(403).send("Access Denied");
    next();
}

function refresh(req: Request, res: Response, next: Function) {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) return res.status(400).send("Refresh Token required");
    try {
        const decoded = jwt.verify(refreshToken, config.get("jwtPrivateKey"));
        req.body.user = decoded;
        next();
    } catch (ex) {
        console.log(ex);
        res.status(400).send("Invalid token");
    }
}

module.exports.auth = auth;
module.exports.admin = admin;
module.exports.refresh = refresh;