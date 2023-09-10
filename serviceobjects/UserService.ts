import Joi from "joi";
import { APIError } from "./APIError";
import { IResponse } from "./Interfaces/IResponse";
import Messages from "./Utilities/Messages";
import { HttpStatusCode } from "./enums/HttpStatusCode";
import { UserRepository } from "../repoitory/UserRepository";
import { IUserModel } from "../database/Models/IUserModel";

export interface IUser extends IResponse {
    id?: string;
    name?: string;
    roles: [number];
    phone?: string;
    gender?: string;
    houseNumber?: string;
    streetNumber?: string;
    streetName?: string;
    city?: string;
    state?: string;
    country?: string;
}

export class UserService {
    repository = new UserRepository();
    constructor() {}

    async me(id: string): Promise<IUser> {
        const user: IUserModel | null = await this.repository.getById(id);

        if (!user) {
            throw new APIError(
                "User Profile Does Not Exist",
                HttpStatusCode.NOT_FOUND,
                "",
                "There is no profile for this user."
            );
        }
        const response: IUser = {
            success: true,
            statusCode: 200,
            id: user.id,
            name: user.name,
            roles: user.roles,
            phone: user.phone,
            gender: user.gender,
            houseNumber: user.houseNumber,
            streetNumber: user.streetNumber,
            streetName: user.streetName,
            city: user.city,
            state: user.state,
            country: user.country,
        };
        return response;
    }

    async updateProfile(requestBody: any): Promise<IResponse> {
        const params: IUser = requestBody;
        const { error } = this.validateProfileUpdate(params);

        if (error) {
            throw new APIError(
                "User Profile Does Not Exist",
                HttpStatusCode.BAD_REQUEST,
                "",
                error.details[0].message
            );
        }
        params.id = requestBody.user._id;
        const profile = await this.repository.getById(params.id!);
        if (!profile) {
            throw new APIError(
                "User Profile Does Not Exist",
                HttpStatusCode.NOT_FOUND,
                "",
                "There is no profile for this user."
            );
        }
        profile.set(params);
        await this.repository.create(profile);

        return {
            success: true,
            statusCode: HttpStatusCode.UPDATED,
        };
    }

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
    validateProfileUpdate(req: IUser): any {
        const schema = Joi.object({
            name: Joi.string()
                .min(1)
                .max(500)
                .optional()
                .messages(Messages.nameValidationMessages()),
            user: Joi.object().optional(),
        });
        return schema.validate(req);
    }
}
