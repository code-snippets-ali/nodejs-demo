import express, { Request, Response } from "express";
import { UserService } from "../serviceobjects/UserService";
const { auth } = require("../middleware/auth");
const router = express.Router();

router.get("/me", auth, async (req: Request, res: Response) => {
    const service = new UserService();
    const profile = await service.me(req.body.user._id);
    res.send(profile);
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

module.exports = router;
