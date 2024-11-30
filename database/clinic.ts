import mongoose, { Document, Schema } from "mongoose";
import { IClinic } from "./Models/IClinic";

const clinicSchema = new Schema<IClinic>({
    name: { type: String, required: true },
    phone: String,
    email: String,
    streetNumber: String,
    streetName: String,
    city: String,
    state: String,
    country: String,
    isActive: { type: Boolean, default: false },
});

const Clinic = mongoose.model("Clinic", clinicSchema);
module.exports.Clinic = Clinic;
module.exports.clinicSchema = clinicSchema;
