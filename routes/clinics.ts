import express, { Request, Response } from "express";
import { admin } from "../middleware/auth";
const { auth } = require("../middleware/auth");
const router = express.Router();

router.post("/", auth, admin, async (req: Request, res: Response) => {});
