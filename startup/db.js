const mongoose = require("mongoose");
module.exports = function (app) {
    mongoose
        .connect(
            "mongodb+srv://ializadar:Mongos02@cluster0.j1cl2.mongodb.net/playground?retryWrites=true&w=majority"
        )
        .then(() => console.log("Connected to MongoDB..."));
};
