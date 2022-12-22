const mongoose = require("mongoose");
const express = require("express");
const info = require("debug")("app:info");
const databaseLog = require("debug")("app:db");
const config = require("config");
const morgan = require("morgan");
const courses = require("./routes/courses");
const users = require("./routes/users");
const auth = require("./routes/authenticate");
const Joi = require("joi");

const app = express();

if (!config.get("jwtPrivateKey")) {
    console.log("Fatal error: jwtPrivateKey is not set");
    process.exit(1);
}
mongoose
    .connect(
        "mongodb+srv://ializadar:Mongos02@cluster0.j1cl2.mongodb.net/playground?retryWrites=true&w=majority"
    )
    .then(() => console.log("Connected to MongoDB..."))
    .catch((err) => console.error("Could not connect to MongoDB..."));

//Middleware
app.use(express.json());
app.use(express.static("public"));
app.use("/api/courses", courses);
app.use("/api/users", users);
app.use("/api/authenticate", auth);

//Configuration
// console.log(" Application name: " + config.get("name"));
// console.log(" Mail Server: " + config.get("mail.host"));
// console.log(" Mail {Password}: " + config.get("mail.password"));

if (app.get("env") === "development") {
    app.use(morgan("tiny"));
    info("morgan enabled");
    databaseLog("Database Logs");
}

app.get("/", (req, res) => {
    res.send("Hello World from Express");
});

const port = process.env.PORT || 8182;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
