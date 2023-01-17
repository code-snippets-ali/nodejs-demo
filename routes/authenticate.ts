import {
    AuthenticationService,
    IAuthenticationResponse,
    ISignupRequest,
} from "../serviceobjects/authenticationService";

import express, { Express, NextFunction, Request, Response } from "express";
const _ = require("lodash");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const { User, expiresIn } = require("../database/user");
const { Profile } = require("../database/profile");
const { refresh } = require("../middleware/auth");

const router = express.Router();

router.post("/register", async (req: Request, res: Response) => {
    const service = new AuthenticationService();
    const authentication: IAuthenticationResponse = await service.registerUser(
        req.body
    );
    res.status(authentication.statusCode)
        .header("x-auth-token", authentication.accessToken ?? "")
        .send(authentication);
});

router.post("/signin", async (req, res) => {
    const service = new AuthenticationService();
    const authentication: IAuthenticationResponse = await service.signIn(
        req.body
    );
    res.status(authentication.statusCode)
        .header("x-auth-token", authentication.accessToken ?? "")
        .send(authentication);
});

router.post("/token", refresh, async (req, res) => {
    const service = new AuthenticationService();
    const authentication: IAuthenticationResponse = await service.refreshToken(
        req.body.us
    );
    res.header("x-auth-token", authentication.accessToken ?? "").send(
        authentication
    );
});

module.exports = router;
