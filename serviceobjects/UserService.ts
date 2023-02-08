const { User } = require("../database/user");
const { Profile } = require("../database/profile");
import Joi from "joi";
import { ResultError, APIError, HttpStatusCode } from "./Error";
import { IResponse } from "./Interfaces/IResponse";
import Messages from "./Utilities/Messages";

export interface IProfile extends IResponse {
    id: String;
    name?: string;
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
    constructor() {}

    async me(id: string): Promise<IProfile> {
        try {
            const profile = await Profile.findById(id);
            const response: IProfile = {
                success: true,
                statusCode: 200,
                id: profile.id,
                name: profile.name,
                phone: profile.phone,
                gender: profile.gender,
                houseNumber: profile.houseNumber,
                streetNumber: profile.streetNumber,
                streetName: profile.streetName,
                city: profile.city,
                state: profile.state,
                country: profile.country,
            };
            return response;
        } catch (error: any) {
            throw new APIError(
                "Server Error",
                HttpStatusCode.INTERNAL_SERVER,
                error.message,
                "This is message for user",
                true
            );
        }
    }

    async updateProfile(requestBody: any): Promise<IResponse> {
        try {
            const params: IProfile = requestBody;

            const { error } = this.validateProfileUpdate(params);
            if (error) {
                return {
                    success: false,
                    statusCode: HttpStatusCode.BAD_REQUEST,
                    message: error.details[0].message,
                };
            }
            params.id = requestBody.user._id;
            const profile = await Profile.findById(params.id);
            if (!profile) {
                return {
                    success: false,
                    statusCode: HttpStatusCode.NOT_FOUND,
                    message: "User not found",
                };
            }
            profile.set(params);
            const result = profile.save();
            return {
                success: true,
                statusCode: HttpStatusCode.UPDATED,
            };
        } catch (error: any) {
            throw new APIError(
                "Server Error",
                HttpStatusCode.INTERNAL_SERVER,
                error.message,
                "This is message for user",
                true
            );
        }
    }

    validateProfileUpdate(req: IProfile): any {
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
