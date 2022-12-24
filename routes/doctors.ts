const { auth } = require("../middleware/auth");
import express, { Express, Request, Response } from "express";
const router = express.Router();
const { DoctorService } = require("../serviceobjects/doctorsService");
import { IDoctor, DoctorViewModel } from "../ViewModels/DoctorViewModel";
import { DoctorsService } from "../serviceobjects/doctorsService";

router.get("/", (req: Request, res: Response) => {
    const service = new DoctorsService();
    res.send(service.getAllDoctors());
});

router.get("/:id", (req: Request, res: Response) => {});

router.post("/", (req: Request, res: Response) => {
    const params = req.body;
    const doctor = new DoctorViewModel(params);
    doctor.houseNumber = req.body["houseNumber"];

    res.send(doctor);
});
module.exports = router;
