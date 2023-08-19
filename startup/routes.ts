import express, { NextFunction, Request, Response } from "express";
import { APIError, HttpStatusCode } from "../serviceobjects/Error";

const courses = require("../routes/courses");
const users = require("../routes/users");
const authenticate = require("../routes/authenticate");
const doctors = require("../routes/doctors");
const error = require("../middleware/errorhandler");
const app = express();
const cors = require("cors");
module.exports = function () {
    //
    app.use(cors());
    app.use(express.json());
    app.use(express.static("public"));
    app.use("/api/courses", courses);
    app.use("/api/users", users);
    app.use("/api/authenticate", authenticate);
    app.use("/api/doctors", doctors);
    app.all("*", (req: Request, res: Response, next: NextFunction) => {
        const apiError = new APIError(
            "URL not found",
            HttpStatusCode.NOT_FOUND,
            `Following URL is not found ${req.baseUrl + req.originalUrl}`,
            "",
            false
        );
        next(apiError);
        // res.status(404).json({
        //     success: false,
        //     message: `Can't find the following URL ${req.originalUrl}`,
        //     statusCode: 404,
        // });
    });
    app.use(error);

    const port = process.env.PORT || 8182;

    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    });
};
