const mongoose = require("mongoose");
const Medicin = require("./medicine");
const Diagnosis = require("./diagnosis");
const Test = require("./test");

const appointmentSchema = new mongoose.Schema({
    date: Date,
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    medicines: [Medicine],
    tests: [Test],
    diagnosis: [Diagnosis],
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;
