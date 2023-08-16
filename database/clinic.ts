import mongoose, { Document, Schema } from "mongoose";

const doctorSchema = require("./doctor");
const clinicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: String,
    email: String,
    gps: String,
    houseNumber: String,
    streetNumber: String,
    streetName: String,
    city: String,
    state: String,
    country: String,
    doctors: [doctorSchema],
});

const Clinic = mongoose.model("Clinic", doctorSchema);
module.exports.Clinic = Clinic;
module.exports.clinicSchema = clinicSchema;
