import express from "express";
import { validateRegisterRequest } from "../core-sdk/contracts/auhentication/RegisterRequest";
import { validateSignInRequest } from "../core-sdk/contracts/auhentication/SigninRequest";
import { validateForgotPasswordRequest } from "../core-sdk/contracts/auhentication/ForgotPasswordRequest";
import { validateResetPasswordRequest } from "../core-sdk/contracts/auhentication/ResetPasswordRequest";
import { validateUpdatePasswordRequest } from "../core-sdk/contracts/auhentication/UpdatePasswordRequest";
import { validateRefreshTokenRequest } from "../core-sdk/contracts/auhentication/RefreshTokenRequest";

const { auth, refresh } = require("../middleware/auth");

const {
    register,
    signin,
    refreshToken,
    forgotPassword,
    resetPassword,
    updatePassword,
} = require("../controllers/authenticationController");

const router = express.Router();

router.post("/register", validateRegisterRequest, register);

router.post("/signin", validateSignInRequest, signin);

router.post("/token", validateRefreshTokenRequest, refresh, refreshToken);

router.post("/forgot-password", validateForgotPasswordRequest, forgotPassword);

router.post("/reset-password", validateResetPasswordRequest, resetPassword);

router.post(
    "/update-password",
    auth,
    validateUpdatePasswordRequest,
    updatePassword
);

module.exports = router;
