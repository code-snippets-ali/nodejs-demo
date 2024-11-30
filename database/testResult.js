const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    value: Number,
    max: Number,
    low: Number,
    description: String,
});

const Test = mongoose.model("Test", testSchema);

module.exports = Test;
