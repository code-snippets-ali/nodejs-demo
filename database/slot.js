const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
    startHour: {
        type: Number,
        min: 0,
        max: 23,
    },
    startMinute: {
        type: Number,
        min: 0,
        max: 60,
    },
    duration: Number,
});

const Slot = mongoose.model("Slot", medicinSchema);

module.exports = Slot;
