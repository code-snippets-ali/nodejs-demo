import express from "express";
const app = express();

app.use(require("cors")());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/users", require("../routes/users"));
app.use("/api/authenticate", require("../routes/authenticate"));
app.use("/api/doctors", require("../routes/doctors"));
app.all("*", require("../routes/unhandledRoute"));
app.use(require("../middleware/errorhandler"));

module.exports = app;
