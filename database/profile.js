const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: String,
    gender: String,
    houseNumber: String,
    streetNumber: String,
    streetNumber: String,
    city: String,
    state: String,
    country: String,
});

const Profile = mongoose.model("Profile", profileSchema);
exports.Profile = Profile;
