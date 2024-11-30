import mongoose, { Document, Schema } from "mongoose";
import { IDoctor } from "./Models/IDoctor";

const doctorSchema = new Schema<IDoctor>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    specialization: { type: String, required: true },
    description: String,
    isActive: { type: Boolean, default: false },
});

const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports.Doctor = Doctor;
module.exports.doctorSchema = doctorSchema;
