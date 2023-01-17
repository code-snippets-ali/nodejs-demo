const { User } = require("../database/user");
const { Profile } = require("../database/profile");
const Joi = require("joi");
const bcrypt = require("bcrypt");
import { DBConstants } from "../database/DBConstants";

import { ResultError, APIError, HttpStatusCode } from "./Error";
import Messages from "./Utilities/Messages";

const jwt = require("jsonwebtoken");
const config = require("config");

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

export interface IAuthenticationResponse {
    accessToken?: string;
    refreshToken?: String;
    expiresIn?: String;
    success: boolean;
    error?: string;
}

//#endregion

export class AuthenticationService {
    constructor() {}

    async refreshToken(
        params: IRefreshTokenRequest
    ): Promise<IAuthenticationResponse> {
        try {
            const profile = await Profile.findOne({ _id: params._id });

            if (!profile) {
                const response: IAuthenticationResponse = {
                    success: false,
                    error: "Unable to refresh token. Please sign in again",
                };
                return response;
            }
            const response: IAuthenticationResponse = {
                accessToken: this.generateToken(profile._id, profile.isAdmin),
                refreshToken: this.generateRefreshToken(profile._id),
                expiresIn: expires_accessToken,
                success: true,
            };
            return response;
        } catch (error: any) {
            console.log("Creation Error");
            throw new APIError(
                "Server Error",
                HttpStatusCode.INTERNAL_SERVER,
                error.message,
                "This is message for user",
                true
            );
        }
    }

    async signIn(params: ISigninRequest): Promise<IAuthenticationResponse> {
        try {
            let user = await User.findOne({ email: params.email }).populate(
                "profile"
            );

            if (!user) {
                const response: IAuthenticationResponse = {
                    success: false,
                    error: "There is no user with this email id",
                };
                return response;
            }
            const isValidPassword = await bcrypt.compare(
                params.password,
                user.password
            );
            if (!isValidPassword) {
                const response: IAuthenticationResponse = {
                    success: false,
                    error: "This is incorrect password",
                };
                return response;
            }
            const response: IAuthenticationResponse = {
                accessToken: this.generateToken(user.profile._id, user.isAdmin),
                refreshToken: this.generateRefreshToken(user.profile._id),
                expiresIn: expires_accessToken,
                success: true,
            };
            return response;
        } catch (error: any) {
            console.log("Creation Error");
            throw new APIError(
                "Server Error",
                HttpStatusCode.INTERNAL_SERVER,
                error.message,
                "This is message for user",
                true
            );
        }
    }

    async registerUser(
        params: ISignupRequest
    ): Promise<IAuthenticationResponse> {
        // throw new APIError("BAD REQUEST", 400, "This is a bad request", true);

        try {
            const existingUser = await User.findOne({ email: params.email });
            if (existingUser) {
                const response: IAuthenticationResponse = {
                    error: "User already exist. Please sign in",
                    success: false,
                };
                return response;
            }

            const salt = await bcrypt.genSalt(12);
            const hash = await bcrypt.hash(params.password, salt);

            const user = new User({
                name: params.name,
                email: params.email,
                password: hash,
            });

            const profile = new Profile({
                name: params.name,
                email: params.email,
            });
            user.profile = profile;
            await user.save();
            profile.user = user;
            await profile.save();

            const response: IAuthenticationResponse = {
                accessToken: this.generateToken(profile._id, profile.isAdmin),
                refreshToken: this.generateRefreshToken(profile._id),
                expiresIn: expires_accessToken,
                success: true,
            };
            return response;
        } catch (error: any) {
            console.log("Creation Error");
            throw new APIError(
                "Server Error",
                HttpStatusCode.INTERNAL_SERVER,
                error.message,
                "This is message for user",
                true
            );
        }
    }

    //#region Generate Access and Refresh token

    generateToken(profileId: String, isAdmin: Boolean): string {
        const token = jwt.sign(
            { _id: profileId, isAdmin: isAdmin },
            config.get("jwtPrivateKey"),
            { expiresIn: expires_accessToken }
        );
        return token;
    }

    generateRefreshToken(profileId: String): string {
        const refresh_token = jwt.sign(
            { _id: profileId },
            config.get("jwtPrivateKey"),
            { expiresIn: expires_RefreshToken }
        );
        return refresh_token;
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
