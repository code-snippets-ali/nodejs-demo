const mongoose = require("mongoose");
const Slot = require("./slot");

const shiftSchema = new mongoose.Schema({
    duration: {
        type: Number,
        required: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    slots: [Slot],
});

const Shift = mongoose.model("Shift", shiftSchema);
module.exports = Shift;
