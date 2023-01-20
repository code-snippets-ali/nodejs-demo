const { User } = require("../database/user");
const { Profile } = require("../database/profile");
const Joi = require("joi");
const bcrypt = require("bcrypt");
import { DBConstants } from "../database/DBConstants";

import { ResultError, APIError, HttpStatusCode } from "./Error";
import Messages from "./Utilities/Messages";
import { IResponse } from "./Interfaces/IResponse";
import { appConfig, Settings } from "./Utilities/Settings";

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
    refreshToken?: String;
    expiresIn?: String;
}

//#endregion

export class AuthenticationService {
    constructor() {}

    async refreshToken(
        params: IRefreshTokenRequest
    ): Promise<IAuthenticationResponse> {
        const profile = await Profile.findOne({ _id: params._id });

        if (!profile) {
            const response: IAuthenticationResponse = {
                success: false,
                message: "Unable to refresh token. Please sign in again",
                statusCode: HttpStatusCode.BAD_REQUEST,
            };
            return response;
        }
        const response: IAuthenticationResponse = {
            accessToken: this.generateToken(profile._id, profile.isAdmin),
            refreshToken: this.generateRefreshToken(profile._id),
            expiresIn: expires_accessToken,
            success: true,
            statusCode: HttpStatusCode.OK,
        };
        return response;
    }

    async signIn(params: ISigninRequest): Promise<IAuthenticationResponse> {
        const { error } = this.validateSignin(params);
        if (error) {
            return {
                success: false,
                statusCode: HttpStatusCode.BAD_REQUEST,
                message: error.details[0].message,
            };
        }

        let user = await User.findOne({ email: params.email }).populate(
            "profile"
        );

        if (!user) {
            const response: IAuthenticationResponse = {
                success: false,
                message: "There is no user with this email id",
                statusCode: HttpStatusCode.NOT_FOUND,
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
                message: "This is incorrect password",
                statusCode: HttpStatusCode.BAD_REQUEST,
            };
            return response;
        }
        const response: IAuthenticationResponse = {
            accessToken: this.generateToken(
                user.profile._id,
                user.profile.isAdmin
            ),
            refreshToken: this.generateRefreshToken(user.profile._id),
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
            return {
                success: false,
                statusCode: HttpStatusCode.BAD_REQUEST,
                message: error.details[0].message,
            };
        }
        const existingUser = await User.findOne({ email: params.email });
        if (existingUser) {
            const response: IAuthenticationResponse = {
                message: "User already exist. Please sign in",
                success: false,
                statusCode: HttpStatusCode.BAD_REQUEST,
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
            statusCode: HttpStatusCode.CREATED,
        };
        return response;
    }

    //#region Generate Access and Refresh token

    generateToken(profileId: String, isAdmin: Boolean): string {
        const token = jwt.sign(
            { _id: profileId, isAdmin: isAdmin },
            appConfig(Settings.JWTPrivateKey),
            { expiresIn: expires_accessToken }
        );
        return token;
    }

    generateRefreshToken(profileId: String): string {
        const refresh_token = jwt.sign(
            { _id: profileId },
            appConfig(Settings.JWTPrivateKey),
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
