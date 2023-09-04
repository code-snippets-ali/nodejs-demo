const { Authenticate } = require("../database/authenticate");
const { User } = require("../database/user");
const Joi = require("joi");
const bcrypt = require("bcrypt");
import { DBConstants } from "../database/DBConstants";

import { APIError } from "./APIError";
import { HttpStatusCode } from "./enums/HttpStatusCode";
import Messages from "./Utilities/Messages";
import { IResponse } from "./Interfaces/IResponse";
import { appConfig, Settings } from "./Utilities/Settings";
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const expires_accessToken = "8h";
const expires_RefreshToken = "30d";

//#region validation Error Messages
enum Validations {
    email_invalid = "Please provide a valid email address.",
    email_required = "Please provide an email to continue.",
    email_empty = "Email provided is empty. Please provide a valid email address",
    email_max = "Email address is too long. Please do not provide more than 500 characters.",

    password = "Please proide a password for regietering new account.",
    password_min = "Please provide atleast 5 characters for your password.",
    password_max = "Password is too long. Please do not provide more than 500 characters for password.",

    name_required = "Please provide your name to register a new account.",
    name_min = "Please provide atleast one character for your name",
    name_max = "Name is too long. Please do not provide more than 500 characters.",
}

//#endregion

//#region Request Interfaces

export interface IRefreshTokenRequest {
    _id: string;
}
export interface ISignupRequest {
    name: string;
    email: string;
    password: string;
}
export interface ISigninRequest {
    email: string;
    password: string;
}

//#endregion

//#region Response interfaces

export interface IAuthenticationResponse extends IResponse {
    accessToken?: string;
    refreshToken?: string;
    expiresIn?: string;
}

//#endregion

export class AuthenticationService {
    constructor() {}

    async refreshToken(
        params: IRefreshTokenRequest
    ): Promise<IAuthenticationResponse> {
        const user = await User.findOne({ _id: params._id });

        if (!user) {
            throw new APIError(
                "Refresh Token User does not exist",
                HttpStatusCode.BAD_REQUEST,
                "",
                "Unable to refresh token. Please sign in again"
            );
        }
        const response: IAuthenticationResponse = {
            accessToken: this.generateToken(user._id, user.access_level),
            refreshToken: this.generateRefreshToken(user._id),
            expiresIn: expires_accessToken,
            success: true,
            statusCode: HttpStatusCode.OK,
        };
        return response;
    }

    async signIn(params: ISigninRequest): Promise<IAuthenticationResponse> {
        const { error } = this.validateSignin(params);
        if (error) {
            throw new APIError(
                "Sign in validation",
                HttpStatusCode.BAD_REQUEST,
                "",
                error.details[0].message
            );
        }

        let authenticated = await Authenticate.findOne({
            email: params.email,
        }).populate("user");

        if (!authenticated) {
            throw new APIError(
                "Sign in email not registered",
                HttpStatusCode.NOT_FOUND,
                "",
                "The email you've entered doesn't match any account."
            );
        }
        const isValidPassword = await bcrypt.compare(
            params.password,
            authenticated.password
        );
        if (!isValidPassword) {
            throw new APIError(
                "Sign in password is not correct",
                HttpStatusCode.UNAUTHORIZED,
                "",
                "The password is incorrect."
            );
        }
        const response: IAuthenticationResponse = {
            accessToken: this.generateToken(
                authenticated.user._id,
                authenticated.user.access_level
            ),
            refreshToken: this.generateRefreshToken(authenticated.user._id),
            expiresIn: expires_accessToken,
            success: true,
            statusCode: HttpStatusCode.OK,
        };
        return response;
    }

    async registerUser(
        params: ISignupRequest
    ): Promise<IAuthenticationResponse> {
        const { error } = this.validateCreate(params);
        if (error) {
            throw new APIError(
                "Registration Validation Failed",
                HttpStatusCode.BAD_REQUEST,
                "",
                error.details[0].message
            );
        }
        const authenticated = await Authenticate.findOne({
            email: params.email,
        });
        if (authenticated) {
            throw new APIError(
                "Registration User Already Exist",
                HttpStatusCode.BAD_REQUEST,
                "",
                "User already exist. Please sign in"
            );
        }

        const salt = await bcrypt.genSalt(12);
        const hash = await bcrypt.hash(params.password, salt);

        const authentication = new Authenticate({
            email: params.email,
            password: hash,
        });

        const user = new User({
            name: params.name,
            email: params.email,
        });
        authentication.user = user;
        await authentication.save();
        await user.save();

        const response: IAuthenticationResponse = {
            accessToken: this.generateToken(user._id, user.access_level),
            refreshToken: this.generateRefreshToken(user._id),
            expiresIn: expires_accessToken,
            success: true,
            statusCode: HttpStatusCode.CREATED,
        };
        return response;
    }

    async forgotPassword(email: string): Promise<IResponse> {
        if (!email) {
            throw new APIError(
                "Email not provided",
                HttpStatusCode.BAD_REQUEST,
                "",
                "Please provide email address to continue",
                true
            );
        }
        const authenticated = await Authenticate.findOne({ email: email });

        if (!authenticated) {
            throw new APIError(
                "Email Does not exist",
                HttpStatusCode.NOT_FOUND,
                "",
                "This email address does not exist in our system",
                true
            );
        }

        const token = this.generateForgotPasswordToken();
        authenticated.passwordResetToken = token[1];
        authenticated.passwordResetExpires = Date.now() + 10 * 60 * 1000;

        await authenticated.save();

        const response: IResponse = {
            success: true,
            message: "Email sent to your email address",
            statusCode: 200,
        };

        return response;
    }

    //#region Generate Access and Refresh token

    generateToken(userId: string, access_level: number): string {
        const token = jwt.sign(
            { _id: userId, access_level: access_level },
            appConfig(Settings.JWTPrivateKey),
            { expiresIn: expires_accessToken }
        );
        return token;
    }

    generateRefreshToken(userId: String): string {
        const refresh_token = jwt.sign(
            { _id: userId },
            appConfig(Settings.JWTPrivateKey),
            { expiresIn: expires_RefreshToken }
        );
        return refresh_token;
        HttpStatusCode;
    }

    generateForgotPasswordToken(): [string, string] {
        const resetToken = crypto.randomBytes(32).toString("hex");

        const tokenHash = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        return [resetToken, tokenHash];
    }
    //#endregion

    //#region validating request

    validateCreate(req: any): any {
        console.log("validation started");
        const schema = Joi.object({
            name: Joi.string()
                .min(DBConstants.NameMinLength)
                .max(DBConstants.NameMaxLength)
                .required()
                .messages(Messages.nameValidationMessages()),
            email: Joi.string()
                .email()
                .min(DBConstants.EmailMinLength)
                .max(DBConstants.EmailMaxLength)
                .required()
                .messages(Messages.emailValidationMesages()),
            password: Joi.string()
                .min(DBConstants.PasswordMinLength)
                .max(DBConstants.PasswordMaxLength)
                .required()
                .messages(Messages.passwordValidationMessages()),
        });
        console.log("validation returned");
        return schema.validate(req);
    }

    validateSignin(req: any) {
        console.log("validation started", req);
        const schema = Joi.object({
            email: Joi.string()
                .email()
                .max(DBConstants.EmailMaxLength)
                .min(DBConstants.EmailMinLength)
                .required()
                .messages(Messages.emailValidationMesages()),

            password: Joi.string()
                .min(DBConstants.PasswordMinLength)
                .max(DBConstants.PasswordMaxLength)
                .required(Messages.passwordValidationMessages())
                .messages(Messages.passwordValidationMessages()),
        });
        console.log("validation returned");
        return schema.validate(req);
    }

    //#endregion
}
