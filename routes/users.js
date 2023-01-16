const { auth } = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { User, validate } = require("../database/user");

router.get("/", (req, res) => {
    res.send(courses);
});
router.post("/", auth, async (req, res) => {});

router.get("/me", auth, async (req, res) => {
    req.user._id;
    const user = await User.findById(req.user._id)
        .populate("profile")
        .select("-password");
    res.send(user);
});

router.put("/me", auth, async (req, res) => {
    req.user._id;
    const user = await User.findById(req.user._id)
        .populate("profile")
        .select("-password");
    res.send(user);
});

router.get("/:id", (req, res) => {
    let course = courses.find((c) => c.id === parseInt(req.params.id));
    if (!course) {
        res.status(404).send("Course with given Id is not found");
    } else {
        res.send(course);
    }
});

module.exports = router;
