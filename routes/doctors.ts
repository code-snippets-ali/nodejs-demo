const { auth } = require("../middleware/auth");
import express, { Express, Request, Response } from "express";
const router = express.Router();
const { DoctorService } = require("../serviceobjects/doctorsService");
import { DoctorsService } from "../serviceobjects/doctorsService";
import { ResultError } from "../serviceobjects/Error";
const service = new DoctorsService();

router.get("/", (req: Request, res: Response) => {
    res.send(service.getAllDoctors());
});

router.get("/:id", async (req: Request, res: Response) => {});

router.post("/", async (req: Request, res: Response) => {
    try {
        const doctor = await service.createNewDoctor(req.body);
        res.send(doctor);
    } catch (error: any) {
        res.status(error.statusCode).send(error.message);
    }
    console.log("doctor returned");
});
module.exports = router;
