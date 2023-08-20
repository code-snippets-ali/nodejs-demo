import mongoose, { Document, Schema } from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    access_level: {
        type: Number,
        required: true,
        default: 6,
    },
    phone: String,
    gender: String,
    houseNumber: String,
    streetNumber: String,
    city: String,
    state: String,
    country: String,

    email: {
        type: String,
        unique: true,
        lowercase: true,
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
    },

    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
    },
});

const User = mongoose.model("User", userSchema);
exports.User = User;
exports.userSchema = userSchema;
