const { User, expiresIn } = require("../database/user");
const { Profile } = require("../database/profile");
const Joi = require("joi");
const bcrypt = require("bcrypt");
import { ResultError, APIError, HttpStatusCode } from "./Error";
import { IAuthenticationResponse } from "./authenticationService";
const jwt = require("jsonwebtoken");
const config = require("config");

export interface ISignupRequest {
    name: String;
    email: String;
    password: String;
}
export interface ISigninRequest {
    email: String;
    password: String;
}
export interface IAuthenticationResponse {
    accessToken?: String;
    refreshToken?: String;
    expiresIn?: String;
    success: Boolean;
    error?: String;
}

class AuthenticationService {
    constructor() {}
    async signIn(params: ISigninRequest): Promise<IAuthenticationResponse> {
        const { error } = this.validateSignin(params);
        if (error) {
            console.log("Validation error API Error");
            throw new APIError(
                "BAD REQUEST",
                HttpStatusCode.BAD_REQUEST,
                "This is a bad request",
                "This is message for user",
                true
            );
        }
        try {
            let user = await User.findOne({ email: params.email }).populate(
                "Profile"
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
                expiresIn: expiresIn,
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
        const { error } = this.validateCreate(params);
        if (error) {
            console.log("Validation error API Error");
            throw new APIError(
                "BAD REQUEST",
                HttpStatusCode.BAD_REQUEST,
                "This is a bad request",
                "This is message for user",
                true
            );
        }

        try {
            const salt = await bcrypt.genSalt(12);
            const hash = await bcrypt.hash(params.password, salt);

            const user = new User({
                name: params.name,
                email: params.email,
                pasword: hash,
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
                expiresIn: expiresIn,
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

    generateToken(profileId: String, isAdmin: Boolean): String {
        const token = jwt.sign(
            { _id: profileId, isAdmin: isAdmin },
            config.get("jwtPrivateKey"),
            { expiresIn: expiresIn }
        );
        return token;
    }

    generateRefreshToken(profileId: String): String {
        const refresh_token = jwt.sign(
            { _id: profileId },
            config.get("jwtPrivateKey")
        );
        return refresh_token;
    }

    validateCreate(user: ISignupRequest) {
        console.log("validation started");
        const schema = Joi.object({
            name: Joi.string().max(500),
            email: Joi.string().max(500),
            password: Joi.string().max(200),
        });
        console.log("validation returned");
        return schema.validate(user);
    }

    validateSignin(user: ISigninRequest) {
        console.log("validation started");
        const schema = Joi.object({
            email: Joi.string().max(500),
            password: Joi.string().max(200),
        });
        console.log("validation returned");
        return schema.validate(user);
    }
}
