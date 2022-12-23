const mongoose = require("mongoose");

const medicinSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: String,
});

const Medicin = mongoose.model("Medicin", medicinSchema);

module.exports = Medicin;
