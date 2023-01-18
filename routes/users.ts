import { Request, Response } from "express";
import { UserService } from "../serviceobjects/UserService";

const { auth } = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { User, validate } = require("../database/user");
const { Profile } = require("../database/profile");

router.get("/me", auth, async (req: Request, res: Response) => {
    const service = new UserService();
    const profile = await service.me(req.body.user._id);
    res.send(profile);
});

router.put("/me", auth, async (req: Request, res: Response) => {
    const user = await User.findById(req.body.user._id)
        .populate("profile")
        .select("-password");
    res.send(user);
});
router.patch("/me", auth, async (req: Request, res: Response) => {
    const service = new UserService();

    try {
        let result = await service.updateProfile(req.body);
        if (result.success) {
            res.status(result.statusCode).send();
        } else {
            res.status(result.statusCode).send(result);
        }
    } catch (error: any) {
        res.status(201).send();
    }
});
router.get("/:id", (req: Request, res: Response) => {
    // let course = courses.find((c) => c.id === parseInt(req.params.id));
    // if (!course) {
    //     res.status(404).send("Course with given Id is not found");
    // } else {
    //     res.send(course);
    // }
});

module.exports = router;
