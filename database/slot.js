const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
    startHour: {
        type: Number,
    },
    startMinute: Number,
});

const Medicin = mongoose.model("Medicin", medicinSchema);

module.exports = Medicin;
