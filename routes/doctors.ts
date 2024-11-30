const { auth } = require("../middleware/auth");
import express, { Express, NextFunction, Request, Response } from "express";
const router = express.Router();
const { DoctorService } = require("../serviceobjects/doctorsService");
import { DoctorsService } from "../serviceobjects/doctorsService";
import { APIError, ResultError } from "../core-sdk/APIError";
const service = new DoctorsService();

router.get("/", async (req: Request, res: Response) => {
    const doctors = await service.getAllDoctors();
    res.send(doctors);
});

router.get("/:id", async (req: Request, res: Response) => {});

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("creating new doctor");
        const doctor = await service.createNewDoctor(req.body);
        console.log("doctor returned: " + doctor);
        res.status(201).send(doctor);
    } catch (error: any) {
        // res.status(400).send("This is bad request");
        next(error);
    }
});
module.exports = router;
