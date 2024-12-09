import Joi from "joi";

import Messages from "./Utilities/Messages";
import { HttpStatusCode } from "./enums/HttpStatusCode";
import { UserRepository } from "../repoitory/UserRepository";
import { IUserModel } from "../database/Models/IUserModel";
import { APIError } from "../core-sdk/APIError";
import { IUserResponse } from "../core-sdk/contracts/user/UserResponse";
import { IUserPatchRequest } from "../core-sdk/contracts/user/UserPatchRequest";
import { IUserPutRequest } from "../core-sdk/contracts/user/UserPutRequest";
import { ISignedInUserClient } from "./interfaces/ISignedInUserClient";

export class UserService {
    repository = new UserRepository();
    constructor() {}

    //#region methods to return user and update user profile
    async me(signedInUser: ISignedInUserClient): Promise<IUserResponse> {
        const user: IUserModel | null = await this.repository.getById(
            signedInUser._id
        );

        if (!user) {
            throw new APIError(
                "User Profile Does Not Exist",
                HttpStatusCode.NOT_FOUND,
                "",
                "There is no profile for this user."
            );
        }
        const response: IUserResponse = {
            success: true,
            statusCode: 200,
            id: user.id,
            name: user.name,
            email: user.email,
            isActive: user.isActive,
        };
        return response;
    }

    async updateProfile(
        userPutRequest: IUserPutRequest | IUserPatchRequest,
        signedInUser: ISignedInUserClient
    ): Promise<IUserResponse> {
        const profile = await this.repository.getById(signedInUser._id);
        if (!profile) {
            throw new APIError(
                "User Profile Does Not Exist",
                HttpStatusCode.NOT_FOUND,
                "",
                "There is no profile for this user."
            );
        }
        await this.repository.update(signedInUser._id, userPutRequest);
        const user = await this.me(signedInUser);
        return user;
    }
    //#endregion

    async isActiveUserWithSamePassword(
        id: string,
        tokenTimeStamp: number
    ): Promise<boolean> {
        const user = await this.repository.getById(id);
        if (!user || !user.isActive) {
            throw new APIError(
                "Inactive User",
                HttpStatusCode.UNAUTHORIZED,
                "",
                "This user no longer has an active account"
            );
        }

        console.log(user.passwordUpdatedAt);
        const passwordTimeStamp: number = Math.floor(
            user.passwordUpdatedAt.getTime() / 1000
        );
        if (passwordTimeStamp > tokenTimeStamp) {
            throw new APIError(
                "Password Changed",
                HttpStatusCode.UNAUTHORIZED,
                "",
                "The user has changed his password. Please sign in again"
            );
        }
        return true;
    }

    async hasPasswordChangedAfter(time: number): Promise<boolean> {
        return false;
    }
}
