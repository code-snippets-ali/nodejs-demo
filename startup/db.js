const mongoose = require("mongoose");
const { appConfig, Settings } = require("../serviceobjects/Utilities/Settings");
module.exports = function (app) {
    mongoose
        .connect(appConfig(Settings.DBString))
        .then(() => console.log("Connected to MongoDB..."));
};
