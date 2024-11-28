const mongoose = require("mongoose");
const { appConfig, Settings } = require("../serviceobjects/Utilities/Settings");
module.exports = function (app) {
    mongoose.set("strictQuery", false);
    const connectionString =
        process.env.NODE_ENV === "test"
            ? appConfig(Settings.DBString_Test)
            : appConfig(Settings.DBString);
    mongoose
        .connect(connectionString)
        .then(() => console.log(`Connected to MongoDB...${connectionString}`));
};
