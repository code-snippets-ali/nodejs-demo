const mongoose = require("mongoose");
const { Doctor, doctorSchema } = require("./doctor.js");
const clinicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: [String],
    gps: String,
    houseNumber: String,
    streetNumber: String,
    streetNumber: String,
    city: String,
    state: String,
    country: String,
    doctors: [doctorSchema],
});
