const mongoose = require("mongoose");

mongoose
    .connect(
        "mongodb+srv://ializadar:Mongos02@cluster0.j1cl2.mongodb.net/playground?retryWrites=true&w=majority"
    )
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Could not connect to mongodb", err));

const courseSchema = new mongoose.Schema({
    name: String,
    author: String,
    tags: [String],
    date: { type: Date, default: Date.now },
    isPublished: Boolean,
});
const Course = mongoose.model("Course", courseSchema);

async function createCourse() {
    const course = new Course({
        name: "Data Structure",
        author: "Mosh",
        tags: ["node", "backend"],
        isPublished: true,
    });
    const result = await course.save();
    console.log(result);
}

async function getCourses() {
    const courses = await Course.find();
    console.log(courses);
}

async function getCourses(author) {
    const courses = await Course.find({
        author: author,
    })
        .limit(10)
        .sort({ name: 1 })
        .select({ name: 1, isPublished: 1 });

    console.log(courses);
}

async function updateCourse(id) {
    //Approach- Query first
    //FindById
    //ModifyProperty
    //save
    const course = await Course.findById(id);
    if (!course) return;

    // course.isPublished = true;
    // course.author = "Another Auther";

    course.set({
        isPublished: true,
        author: "Another Author",
    });
    return await course.save();
    //update first
    //Update Directly
    //Optionally get updated document
}

async function updateCourseDirectly(id) {
    const course = await Course.findByIdAndUpdate(
        { id: id },
        {
            $set: {
                isPublished: true,
                author: "Jack",
            },
        },
        { new: true }
    );
}

async function deleteCourse(id) {
    const course = await Course.findByIdAndRemove(id);
    console.log(course);
}

async function practice() {
    // const courses = await Course.find({ price: { $gte: 10, $lte: 20 } });
    // const courses = await Course.find({ price: { $in: [10, 20, 30] } });
    // const courses = await Course.find().or([
    //     { author: "Mosh", isPublished: true },
    // ]);
}

// Comparison operators
// eq, ne, gt, gte, lt, lte, in, nin
//getCourses();
// createCourse();
// getCourses("Mosh");
practice();
