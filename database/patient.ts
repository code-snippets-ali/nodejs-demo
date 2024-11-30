import { Schema, model, Document } from "mongoose";
import { IPatient } from "./Models/IPatient";

const PatientSchema = new Schema<IPatient>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    streetNumber: String,
    streetName: String,
    city: String,
    state: String,
    country: String,
    healthCard: String,
    isActive: { type: Boolean, default: false },
});

const Patient = model<IPatient>("Patient", PatientSchema);

export { IPatient, Patient };
