const mongoose = require("mongoose");
const { userSchema } = require("./user");
const profileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    phone: String,
    gender: String,
    houseNumber: String,
    streetNumber: String,
    streetNumber: String,
    city: String,
    state: String,
    country: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
    },
});

const Profile = mongoose.model("Profile", profileSchema);
exports.Profile = Profile;
exports.profileSchema = profileSchema;
