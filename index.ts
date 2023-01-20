const mongoose = require("mongoose");

const info = require("debug")("app:info");
const databaseLog = require("debug")("app:db");

const morgan = require("morgan");

//Middleware
require("./startup/unhandledExceptions")();
require("./startup/config")();
require("./startup/routes")();
require("./startup/db")();
require("./startup/db")();
// throw new Error("System failed to launch");
// const p = Promise.reject(new Error("This is exception for promise rejection"));
// p.then(() => console.log("Promise completed"));
//Configuration
// console.log(" Application name: " + config.get("name"));
// console.log(" Mail Server: " + config.get("mail.host"));
// console.log(" Mail {Password}: " + config.get("mail.password"));

// if (app.get("env") === "development") {
//     app.use(morgan("tiny"));
//     var a = 3;
//     info("morgan enabled");
//     databaseLog("Database Logs");
// }

// app.get("/", (req, res) => {
//     res.send("Hello World from Express");
// });
