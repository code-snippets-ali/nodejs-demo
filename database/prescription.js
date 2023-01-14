const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
    patient: {
        type: Schema.Types.ObjectId,
        ref: "Patient",
        required: true,
    },
    medicine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medicine",
    },
    name: {
        type: String,
        required: true,
    },
    dosage: {
        type: String,
        required: true,
    },
    unit: {
        type: String,
        required: true,
    },
    quantity: {
        type: String,
        required: true,
    },
    //per day,
    frequency: {
        type: String,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    instructions: {
        type: String,
    },
    doctor: {
        type: Schema.Types.ObjectId,
        ref: "Doctor",
        required: true,
    },
});

const Prescription = mongoose.model("Prescription", prescriptionSchema);

module.exports = Prescription;
