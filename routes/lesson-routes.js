const router = require("express").Router();
const Lesson = require("../models/Lesson.model");
const fileUpload = require("../config/cloudinary");
let ObjectId = require('mongodb').ObjectID;

//Create Lessons
router.post("/add-lesson", async (req, res) => {
    const { title, description, level, price, teacher, tags, imagePreviewUrl, videoUrl, course } = req.body;
    if (!title || !description) {
        res.status(400).json({ message: "missing fields" });
        return;
    }
    try {
        const response = await Lesson.create({
            title,
            description,
            level,
            price,
            course,
            teacher,
            tags,
            imagePreviewUrl,
            videoUrl,
        });
        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({ message: `error occurred ${e}` });
    }
});

//Upload files cloudinary
router.post("/upload", fileUpload.single("file"), (req, res) => {
    try {
        res.status(200).json({ fileUrl: req.file.path });
    } catch (e) {
        res.status(500).json({ message: `error occurred ${e}` });
    }
});

router.get("/lessons", async (req, res) => {
    try {
        const allLessons = await Lesson.find();
        res.status(200).json(allLessons);
    } catch (e) {
        res.status(500).json({ message: `error occurred: ${e}` })
    }
});

router.get("/mylessons", async (req, res) => {
    try {
        const lessons = await Lesson.find({ "teacher": req.session.currentUser });
        res.status(200).json(lessons);
    } catch (e) {
        res.status(500).json({ message: `error occurred: ${e}` })
    }
});

  router.get("/lesson-details/:lessonId", async (req, res) => {
    try {
        const Lessons = await Lesson
            .findById(req.params.lessonId)
            .populate("teacher");;
        res.status(200).json(Lessons);
    } catch (e) {
        res.status(500).json({ message: `error occurred: ${e}` })
    }
});


module.exports = router;
