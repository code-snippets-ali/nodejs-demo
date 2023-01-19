import express from "express";
import { UserService } from "../serviceobjects/UserService";
const { auth } = require("../middleware/auth");
const router = express.Router();

router.get("/me", auth, async (req, res, next) => {
    try {
        const service = new UserService();
        const profile = await service.me(req.body.user._id);
        res.send(profile);
    } catch (ex: any) {
        next(ex);
    }
});

router.patch("/me", auth, async (req, res, next) => {
    try {
        const service = new UserService();
        let result = await service.updateProfile(req.body);
        if (result.success) {
            res.status(result.statusCode).send();
        } else {
            res.status(result.statusCode).send(result);
        }
    } catch (ex: any) {
        next(ex);
    }
});

module.exports = router;
