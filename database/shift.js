const mongoose = require("mongoose");
const Slot = require("./slot");

const shiftSchema = new mongoose.Schema({
    duration: {
        type: Number,
        required: true,
    },
    startTime: {
        type: Date,
    },
    endTime: {
        type: Date,
    },
    slots: [Slot],
});

const Shift = mongoose.model("Shift", shiftSchema);
module.exports = Shift;
