const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const validator = require("validator");
// const admin = require("../configs/firebaseAdmin");

// import middlewares
const verifyJWT = require("../middlewares/verifyJWT");

// import models
const courseModel = require("../models/courseModel");
const chapterModel = require("../models/chapterModel");

/**
GET /api/courses/manage : get all the courses created by instructor
GET /api/courses/:courseid/chapters : get all the chapters in the particular course
POST api/courses/:courseid/newchapter : create a new chapter and save to mongodb ( title, desc,videourl) also add the new chapter id to course.chapters array
DELETE api/courses/:courseid/:chapterid : remove chapter from db and from course.chapters array
PUT api/course/:courseid/:chapterid : update the chapter with the given id
 */

router.get("/courses/manage", verifyJWT, async (req, res) => {
  // make sure that the user in an instructor
  if (req.user.isInstructor) {
    try {
      // get the user id
      const user_id = req.user._id;
      // fetch all the courses where the instructor id matches the userid
      const courses = await courseModel.find({
        instructor: user_id,
      });
      res.json({ courses: courses });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Error while fetching created courses." });
    }
  } else {
    res.status(403).json({ message: "You need to be an instructor." });
  }
});

// GET /api/courses/:courseid/chapters : fetcha all the chapters
router.get("/courses/:courseid/chapters", verifyJWT, async (req, res) => {
  if (!req.user.isInstructor) {
    return res.status(403).json({
      message: "You need to be an instructor to create a new chapter.",
    });
  }
  try {
    const courseObj = await courseModel
      .findById(req.params.courseid)
      .populate("chapters")
      .exec();

    if (JSON.stringify(req.user._id) !== JSON.stringify(courseObj.instructor)) {
      return res.json({ message: "you are not owner of this course." });
    }

    return res.json({ chapters: courseObj.chapters });
  } catch (err) {
    return res.status(500).json({
      message: "Error while fetching chapter details, " + err.message,
    });
  }
});

router.post("/courses/:courseid/newchapter", verifyJWT, async (req, res) => {
  if (!req.user.isInstructor) {
    return res.status(403).json({
      message: "You need to be an instructor to create a new chapter.",
    });
  }

  const courseObj = await courseModel.findById(req.params.courseid);

  if (JSON.stringify(req.user._id) !== JSON.stringify(courseObj.instructor)) {
    return res.json({ message: "you are not owner of this course." });
  }

  try {
    const { title, description, video } = req.body;
    if (!title || !description || !video) {
      return res.status(403).json({
        message:
          "Please provide with the requried fields [ title, description & video ] ",
      });
    }

    const newChapter = new chapterModel({
      title: title,
      description: description,
      video: video,
    });

    const chapterData = await newChapter.save();

    courseObj.chapters.push(newChapter._id);
    await courseObj.save();

    res.json({
      message: "New Chapter created successfully.",
      chapterid: chapterData._id,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error occured while creating a new chapter." });
  }
});

router.delete("/courses/:courseid/:chapterid", verifyJWT, async (req, res) => {
  if (!req.user.isInstructor) {
    return res.status(403).json({
      message: "You need to be an instructor to create a new chapter.",
    });
  }
  try {
    const courseObj = await courseModel.findById(req.params.courseid);

    if (JSON.stringify(req.user._id) !== JSON.stringify(courseObj.instructor)) {
      return res.json({ message: "you are not owner of this course." });
    }

    const updatedChaptersArray = courseObj.chapters.filter((item) => {
      return JSON.stringify(item) !== JSON.stringify(req.params.chapterid);
    });

    courseObj.chapters = updatedChaptersArray;

    await courseObj.save();

    await chapterModel.findByIdAndDelete(req.params.chapterid);
    return res.json({
      message: "chapter was deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error while deleting a chapter, " + err.message,
    });
  }
});

router.put("/courses/:courseid/:chapterid", verifyJWT, async (req, res) => {
  if (!req.user.isInstructor) {
    return res.status(403).json({
      message: "You need to be an instructor to create a new chapter.",
    });
  }

  try {
    const courseObj = await courseModel.findById(req.params.courseid);

    if (JSON.stringify(req.user._id) !== JSON.stringify(courseObj.instructor)) {
      return res.json({ message: "you are not owner of this course." });
    }

    await chapterModel.findByIdAndUpdate(req.params.chapterid, req.body);

    res.json({ message: "Chapter updated successfully." });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error while updating the course, " + err.message });
  }
});

module.exports = router;
