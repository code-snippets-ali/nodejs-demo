const Doctor = require("../database/doctor");
import { ResultError } from "./Error";
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
        const { error } = this.validateCreate(doctor);
        if (error)
            return Promise.reject(new ResultError(400, "This is bad request"));
        const createdDoctor: IDoctor = doctor;
        console.log("Created doctor");

        return createdDoctor;
    }
    async getAllDoctors(): Promise<String> {
        const doctors = await Doctor.find();
        return JSON.stringify(doctors);
    }

    validateCreate(doctor: IDoctor) {
        const schema = Joi.object({
            houseNumber: Joi.string().max(500),
            streetName: Joi.string().max(500),
            streetNumber: Joi.string().max(100),
            city: Joi.string().max(500),
            country: Joi.string().max(500),
        });
        return schema.validate(doctor);
    }
}
export { DoctorsService };
