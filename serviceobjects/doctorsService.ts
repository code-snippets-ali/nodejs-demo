const Doctor = require("../database/doctor");

class DoctorsService {
    constructor() {}
    async getAllDoctors(): Promise<String> {
        const doctors = await Doctor.find();
        return JSON.stringify(doctors);
    }
}
export { DoctorsService };
