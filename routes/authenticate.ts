import express from "express";
import { validateRegisterRequest } from "../core-sdk/contracts/auhentication/RegisterRequest";
import { validateSignInRequest } from "../core-sdk/contracts/auhentication/SigninRequest";
const { refresh } = require("../middleware/auth");

const {
    register,
    signin,
    token,
    forgotPassword,
} = require("../controllers/authenticationController");

const router = express.Router();

router.post("/register", validateRegisterRequest, register);

router.post("/signin", validateSignInRequest, signin);

router.post("/token", refresh, token);

router.post("/forgotpassword", forgotPassword);

module.exports = router;
