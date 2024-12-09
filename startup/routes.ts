import express from "express";
const app = express();

// SECTION: Middleware
app.use(require("helmet")());
app.use(require("express-mongo-sanitize")()); // Protect against NoSQL query injection
app.use(require("xss-clean")()); // Protect against XSS attacks. Malicious html or js code
app.use(require("cors")());
app.use(express.json());
app.use(express.static("public"));

//SECTION: Routes
app.use("/api/users", require("../routes/users"));
app.use("/api/authenticate", require("../routes/authenticate"));
app.use("/api/doctors", require("../routes/doctors"));
app.all("*", require("../routes/unhandledRoute"));
app.use(require("../middleware/errorhandler"));

module.exports = app;
