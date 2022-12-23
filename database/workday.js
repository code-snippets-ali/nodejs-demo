const mongoose = require("mongoose");
const Shift = require("./shift");

const workdaySchema = new mongoose.Schema({
    shifts: [Shift],
    Date: {
        type: Date,
        required: true,
    },
});

const WorkDay = mongoose.model("WorkDay", workdaySchema);
module.exports = WorkDay;
