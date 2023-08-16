import {
    AuthenticationService,
    IAuthenticationResponse,
    ISignupRequest,
} from "../serviceobjects/authenticationService";

import express, { Express, NextFunction, Request, Response } from "express";
const _ = require("lodash");

const { refresh } = require("../middleware/auth");

const {
    register,
    signin,
    token,
} = require("../controllers/AuthenticationController");

const router = express.Router();

router.post("/register", register);

router.post("/signin", signin);

router.post("/token", refresh, token);

module.exports = router;
