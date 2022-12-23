const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    houseNumber: String,
    streetName: String,
    streetNumber: String,
    specialities: {
        type: [String],
    },
});

const Doctor = mongoose.model("Doctor".doctorSchema);
module.exports = Doctor;
