import mongoose, { Document, Schema } from "mongoose";

const doctorSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    licence_number: String,
    title: String,
    qualification: String,
    education: String,
    board_certificates: String,
    specializations: {
        type: [String],
    },
    registration_number: String,
    practice_start_date: Date,
    languages_spoken: [String],
    professional_memberships: String,
    research_interests: String,
    awards_and_recognition: String,
    general_description: String,
    profile_picture_url: String,
    hospital_affiliation: String,
    training: String,
});

const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports.Doctor = Doctor;
module.exports.doctorSchema = doctorSchema;
