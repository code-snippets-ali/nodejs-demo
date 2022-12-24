const Joi = require("joi");

export interface IDoctor {
    userId: String;
    houseNumber: String;
    streetName: String;
    streetNumber: Number;
    specialities: [String];
}

export class DoctorViewModel {
    userId: String = "";
    houseNumber: String = "";
    streetName: String = "";
    streetNumber: Number = -1;
    specialities: [String] = [""];
    constructor(params: IDoctor) {}

    validate(): boolean {
        return false;
    }
}
