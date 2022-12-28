const Doctor = require("../database/doctor");
import { ResultError, APIError, HttpStatusCode } from "./Error";
const Joi = require("joi");
export interface IDoctor {
    userId: String;
    houseNumber: String;
    streetName: String;
    streetNumber: Number;
    city: String;
    country: String;
    specialities?: [String];
}
class DoctorsService {
    constructor() {}
    async createNewDoctor(doctor: IDoctor): Promise<IDoctor> {
        // throw new APIError("BAD REQUEST", 400, "This is a bad request", true);
        const { error } = this.validateCreate(doctor);
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

        const createdDoctor = new Doctor(doctor);
        try {
            await createdDoctor.save();
            console.log("Created doctor");
            const responsDoctor: IDoctor = createdDoctor;
            return responsDoctor;
        } catch (error: any) {
            console.log("Creation Error");
            throw new APIError(
                "Server Error",
                HttpStatusCode.INTERNAL_SERVER,
                "Theres is some preblem with service. Please try later",
                "This is message for user",
                true
            );
        }
    }
    async getAllDoctors(): Promise<String> {
        const doctors = await Doctor.find();
        return JSON.stringify(doctors);
    }

    validateCreate(doctor: IDoctor) {
        console.log("validation started");
        const schema = Joi.object({
            userId: Joi.string().max(500),
            houseNumber: Joi.string().max(500),
            streetName: Joi.string().max(500),
            streetNumber: Joi.string().max(100),
            city: Joi.string().max(500),
            country: Joi.string().max(500),
        });
        console.log("validation returned");
        return schema.validate(doctor);
    }
}
export { DoctorsService };
