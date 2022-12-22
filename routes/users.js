const { auth } = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { User, validate } = require("../database/user");

router.get("/", (req, res) => {
    res.send(courses);
});
router.get("/me", auth, async (req, res) => {
    req.user._id;
    const user = await User.findById(req.user._id).select("-password");
    res.send(user);
});
router.post("/register", async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already registered");

    user = new User(_.pick(req.body, ["name", "email", "password"]));
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    await user.save();
    const token = user.generateToken;
    res.header("x-auth-token", token).send(
        _.pick(user, ["_id", "name", "email"])
    );
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
