const { User } = require("../database/user");
import Joi from "joi";
import { ResultError, APIError, HttpStatusCode } from "./Error";
import { IResponse } from "./Interfaces/IResponse";
import Messages from "./Utilities/Messages";

export interface IUser extends IResponse {
    id?: String;
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

    async me(id: string): Promise<IUser> {
        const user = await User.findById(id);

        if (!user) {
            const response: IUser = {
                success: false,
                message: "There is no profile for this user.",
                statusCode: HttpStatusCode.NOT_FOUND,
            };
            return response;
        }
        const response: IUser = {
            success: true,
            statusCode: 200,
            id: user.id,
            name: user.name,
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
            return {
                success: false,
                statusCode: HttpStatusCode.BAD_REQUEST,
                message: error.details[0].message,
            };
        }
        params.id = requestBody.user._id;
        const profile = await User.findById(params.id);
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
