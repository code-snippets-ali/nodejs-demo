import { express } from "express";
const courses = require("../routes/courses");
const users = require("../routes/users");
const authenticate = require("../routes/authenticate");
const doctors = require("../routes/doctors");
const error = require("../middleware/errorhandler");

module.exports = function (app) {
    // app.use(express.json());
    // app.use(express.static("../public"));
    // app.use("/api/courses", courses);
    // app.use("/api/users", users);
    // app.use("/api/authenticate", authenticate);
    // app.use("/api/doctors", doctors);
    // app.use(error);
};
