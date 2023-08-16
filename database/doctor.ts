import mongoose, { Document, Schema } from "mongoose";

const doctorSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },

    specialities: {
        type: [String],
    },
    training: String,
    certification: String,
    practiceStartDate: Date,
    education: String,
    licences: String,
});

const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports.Doctor = Doctor;
module.exports.doctorSchema = doctorSchema;