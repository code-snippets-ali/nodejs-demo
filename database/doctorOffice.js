const mongoose = require("mongoose");

const doctorOfficeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: [String],
    gps: String,
    houseNumber: String,
    streetNumber: String,
    streetNumber: String,
    city: String,
    state: String,
    country: String,
});
