const mongoose = require("mongoose");

const diagnosisSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: String,
});

const Diagnosis = mongoose.model("Diagnosis", diagnosisSchema);

module.exports = Diagnosis;
