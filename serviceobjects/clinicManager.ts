import Joi from "joi";
import { IDoctor } from "./doctorsService";
import { APIError, HttpStatusCode } from "./APIError";
import { IResponse } from "./Interfaces/IResponse";
const { Clinic, clinicSchema } = require("./clinic.js");

export interface IClinic extends IResponse {
    id?: String;
    name: string;
    phone: string;
    houseNumber?: string;
    streetNumber?: string;
    streetName?: string;
    city?: string;
    state?: string;
    country?: string;
    doctors?: [IDoctor];
}

export class ClinicManager {
    constructor() {}
    async createClinic(params: IClinic): Promise<IClinic> {
        try {
            const clinic = new Clinic({
                name: params.name,
                phone: params.phone,
                houseNumber: params.houseNumber,
                streetName: params.streetName,
                city: params.city,
                state: params.state,
                country: params.country,
            });

            const result = await clinic.save();
            params = clinic;
            params.success = true;
            params.statusCode = HttpStatusCode.CREATED;
            return params;
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

    validateCreate(req: any) {
        const schema = Joi.object({
            name: Joi.string().min(1).max(500).required().messages({}),
            email: Joi.string().email().min(1).max(500).required(),
        });
    }
}
