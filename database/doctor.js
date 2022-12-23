const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        maxlength: 255,
        unique: true,
    },
    specialities: {
        type: [String],
    },
    isAdmin: Boolean,
});
