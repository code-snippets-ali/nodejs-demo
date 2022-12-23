const Doctor = require("../database/doctor");

class DoctorsService {
    ID: String;
    userId: String;
    houseNumber: String;
    streetName: String;
    streetNumber: String;
    specialities: [String];

    getAllDoctors(): DoctorViewModel {
        return new DoctorViewModel();
    }
}
