const Joi = require("joi");
const bcrypt = require("bcrypt");

import { APIError } from "../core-sdk/APIError";
import { HttpStatusCode } from "./enums/HttpStatusCode";
import { IResponse } from "../core-sdk/contracts/IResponse";
import { appConfig, Settings } from "./Utilities/Settings";
import { EmailService } from "./EmailService";
import { AuthenticationRepository } from "../repoitory/authenticationRepository";
import { IAuthenticateModel } from "../database/Models/IAuthenticateModel";
import { UserRepository } from "../repoitory/UserRepository";
import { IUserModel } from "../database/Models/IUserModel";
import { IRegisterRequest } from "../core-sdk/contracts/auhentication/RegisterRequest";
import { ISignInRequest } from "../core-sdk/contracts/auhentication/SigninRequest";
import { IAuthenticationResponse } from "../core-sdk/contracts/auhentication/AuthenticationResponse";
import { create } from "../database/diagnosis";
import { IForgotPasswordRequest } from "../core-sdk/contracts/auhentication/ForgotPasswordRequest";
import { IResetPasswordRequest } from "../core-sdk/contracts/auhentication/ResetPasswordRequest";
import { IUpdatePasswordRequest } from "../core-sdk/contracts/auhentication/UpdatePasswordRequest";
import { IRefreshUserClient } from "./interfaces/ISignedInUserClient";
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const expires_accessToken = "8h";
const expires_RefreshToken = "30d";

//#region Request Interfaces

export interface IRefreshTokenRequest {
    _id: string;
}

export interface ISigninRequest {
    email: string;
    password: string;
}

//#endregion

export class AuthenticationService {
    repository: AuthenticationRepository = new AuthenticationRepository();
    userRepository: UserRepository = new UserRepository();
    constructor() {}
    //#region Authentication Methods

    async registerUser(
        params: IRegisterRequest
    ): Promise<IAuthenticationResponse> {
        const authenticated: IAuthenticateModel | null =
            await this.repository.findByEmail(params.email);
        if (authenticated) {
            throw new APIError(
                "Registration User Already Exist",
                HttpStatusCode.BAD_REQUEST,
                "",
                "User already exist. Please sign in"
            );
        }
        const hash = await this.hashPassword(params.password);
        const user = await this.repository.createAuthenticationForUser(
            params.email,
            hash,
            params.name
        );
        const response: IAuthenticationResponse = {
            accessToken: this.generateToken(user.id!, user.roles),
            refreshToken: this.generateRefreshToken(user.id!),
            expiresIn: expires_accessToken,
            success: true,
            statusCode: HttpStatusCode.CREATED,
        };
        return response;
    }

    async signIn(params: ISignInRequest): Promise<IAuthenticationResponse> {
        const authenticated: IAuthenticateModel | null =
            await this.repository.findByEmail(params.email);

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
                authenticated.user.roles
            ),
            refreshToken: this.generateRefreshToken(authenticated.user._id),
            expiresIn: expires_accessToken,
            success: true,
            statusCode: HttpStatusCode.OK,
        };
        return response;
    }

    async refreshToken(
        params: IRefreshTokenRequest,
        refreshUser: IRefreshUserClient
    ): Promise<IAuthenticationResponse> {
        const user: IUserModel | null = await this.userRepository.getById(
            refreshUser._id
        );

        if (!user) {
            throw new APIError(
                "Refresh Token User does not exist",
                HttpStatusCode.BAD_REQUEST,
                "",
                "Unable to refresh token. Please sign in again"
            );
        }
        const response: IAuthenticationResponse = {
            accessToken: this.generateToken(user._id, user.roles),
            refreshToken: this.generateRefreshToken(user._id),
            expiresIn: expires_accessToken,
            success: true,
            statusCode: HttpStatusCode.OK,
        };
        return response;
    }

    async forgotPassword(
        params: IForgotPasswordRequest,
        resetURL: string
    ): Promise<IResponse> {
        const authenticated = await this.repository.findByEmail(params.email);
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
        authenticated.passwordResetExpires = new Date(
            Date.now() + 10 * 60 * 1000
        );

        await authenticated.save();
        const url = resetURL + `/${token[0]}`;
        const message = `Forgot your password? Please click the link below to reset your password \ ${url}`;
        try {
            await new EmailService().sendEmail({
                email: authenticated.email,
                subject: "Your password reset token (valid for 10 mins)",
                message,
            });
        } catch (ex: any) {
            throw new APIError(
                "Email sending failed",
                HttpStatusCode.INTERNAL_SERVER,
                "Email sending failed",
                "We are unable to send you password reset email. Please try later",
                true
            );
        }
        console.log("Email sent to your email address with token: ", token[0]);
        const response: IResponse = {
            success: true,
            message: "Email sent to your email address",
            statusCode: 200,
        };
        return response;
    }

    async resetPassword(
        params: IResetPasswordRequest
    ): Promise<IAuthenticationResponse> {
        const hashedToken = this.createTokenHash(params.token);
        const authenticated = await this.repository.findByToken(hashedToken);

        if (!authenticated) {
            throw new APIError(
                "Invalid Token",
                HttpStatusCode.BAD_REQUEST,
                "",
                "The token is invalid or has expired",
                true
            );
        }
        const hash = await this.hashPassword(params.changedPassword);

        authenticated.password = hash;
        authenticated.passwordResetToken = undefined;
        authenticated.passwordResetExpires = undefined;
        authenticated.passwordChangedAt = new Date();
        await authenticated.save();

        const user: IUserModel | null = await this.userRepository.getById(
            authenticated.user._id
        );

        if (!user) {
            throw new APIError(
                "User not found",
                HttpStatusCode.NOT_FOUND,
                "",
                "The user associated with this token does not exist",
                true
            );
        }

        const response: IAuthenticationResponse = {
            accessToken: this.generateToken(user.id!, user.roles),
            refreshToken: this.generateRefreshToken(user.id!),
            expiresIn: expires_accessToken,
            success: true,
            statusCode: HttpStatusCode.OK,
        };
        return response;
    }

    async updatePassword(
        params: IUpdatePasswordRequest,
        user: any
    ): Promise<IResponse> {
        const userModel = await this.userRepository.getById(user._id);
        const authenticated = await this.repository.findByEmail(
            userModel!.email
        );
        if (!authenticated) {
            throw new APIError(
                "User not found",
                HttpStatusCode.NOT_FOUND,
                "",
                "The user associated with this token does not have any credentials in our system",
                true
            );
        }

        const isValidPassword = await bcrypt.compare(
            params.currentPassword,
            authenticated!.password
        );
        if (!isValidPassword) {
            throw new APIError(
                "Password is incorrect",
                HttpStatusCode.UNAUTHORIZED,
                "",
                "The password is incorrect",
                true
            );
        }
        const hash = await this.hashPassword(params.newPassword);
        authenticated!.password = hash;
        authenticated.passwordChangedAt = new Date();
        await authenticated.save();

        const response: IResponse = {
            success: true,
            message: "Password updated successfully",
            statusCode: HttpStatusCode.OK,
        };
        return response;
    }
    //#endregion
    //#region Generate Access and Refresh token and also verify token
    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(12);
        return await bcrypt.hash(password, salt);
    }
    generateToken(userId: string, roles: [number]): string {
        const token = jwt.sign(
            { _id: userId, access_level: roles },
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

        const tokenHash = this.createTokenHash(resetToken);

        return [resetToken, tokenHash];
    }

    async verifyToken(token: string): Promise<any> {
        try {
            return await promisify(jwt.verify)(
                token,
                appConfig(Settings.JWTPrivateKey)
            );
        } catch (ex: any) {
            throw new APIError(
                "Invalid Access Token",
                HttpStatusCode.BAD_REQUEST,
                "",
                "You donot have permission for this action"
            );
        }
    }

    createTokenHash(token: string): string {
        return crypto.createHash("sha256").update(token).digest("hex");
    }
    //#endregion
}
