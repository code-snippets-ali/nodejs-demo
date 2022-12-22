const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { auth, admin } = require("../middleware/auth");
const courses = [
    { id: 1, name: "Intor to Programming" },
    { id: 2, name: "Data Structure" },
    { id: 3, name: "Algorithm" },
];

router.get("/", (req, res) => {
    res.send(courses);
});

router.get("/:id", (req, res) => {
    let course = courses.find((c) => c.id === parseInt(req.params.id));
    if (!course) {
        res.status(404).send("Course with given Id is not found");
    } else {
        res.send(course);
    }
});

router.post("/", auth, (req, res) => {
    const { error } = validateCourse(req.body);

    if (error) {
        res.status(404).send(error.details[0]);
        return;
    }
    const course = {
        id: courses.length + 1,
        nme: req.body.name,
    };
    courses.push(course);
    res.send(course);
});

router.put("/:id", (req, res) => {
    let course = courses.find((c) => c.id === parseInt(req.params.id));

    if (!course) {
        res.status(404).send("Course with given Id is not found");
        return;
    }
    const { error } = validateCourse(req.body);
    if (error) {
        res.status(400).send(error.details[0]);
        return;
    }
    course.name = req.body.name;
    res.send(course);
});

router.delete("/:id", [auth, admin], (req, res) => {
    let course = courses.find((c) => c.id === parseInt(req.params.id));

    if (!course) {
        res.status(404).send("Course with given Id is not found");
        return;
    }
    courses.splice(courses.indexOf(course), 1);
    res.send(course);
});

function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
    });
    const result = schema.validate(course);
    return result;
}

module.exports = router;
