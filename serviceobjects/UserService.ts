const { User } = require("../database/user");
const { Profile } = require("../database/profile");
import Joi from "joi";
import { ResultError, APIError, HttpStatusCode } from "./Error";

export interface IProfile {
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

    async updateProfile(params: IProfile): Promise<boolean> {
        try {
            if (!this.validateProfileUpdate(params)) {
                return false;
            }
            const profile = await Profile.findById(params.id);
            if (!profile) return false;
            profile.set(params);
            const result = profile.save();
            return true;
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

    validateProfileUpdate(req: any): any {
        const schema = Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Please provide an id to update profile",
                "string.empty": "Please provide a valid id to update profile",
            }),
            name: Joi.string().min(1).max(500).optional().messages({
                "string.empty": "Please enter atleast one character",
                "string.min": "Please enter atleast one character",
                "string.max":
                    "Name is too long. Please do not enter more than 500 characters",
            }),
        });
        return schema.validate(req);
    }
}
