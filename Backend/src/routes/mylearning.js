const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// import middlewares
const verifyJWT = require("../middlewares/verifyJWT");

// import models
const userModel = require("../models/userModel");
const courseModel = require("../models/courseModel");

// POST /api/enroll
// Body: {
//   "courseId": "course_id_here"
// }
// GET /api/users/learning/courses : fetch the list of purchased courses
// GET /api/users/learning/:courseid : fetch the specified course, with instructor deail and chapters

router.post("/enroll", verifyJWT, async (req, res) => {
  // check if user has already purchased the course

  const alreadyEnrolled = req.user.purchasedCourses
    .map((item) => JSON.stringify(item))
    .includes(JSON.stringify(new mongoose.Types.ObjectId(req.body.courseId)));

  if (alreadyEnrolled) {
    return res
      .status(403)
      .json({ message: "You have already enrolled in this course." });
  }

  // make sure if the course actually exists or not
  const course = await courseModel.findById(req.body.courseId);

  if (!course) {
    return res
      .status(403)
      .json({ message: "The course you are looking for doesn't exist" });
  }

  req.user.purchasedCourses.push(course._id);
  await req.user.save();

  res.json({ message: "Successfully enrolled in the course." });
});

// GET /api/users/learning/courses : shows the list of purchased courses

router.get("/users/learning/courses", verifyJWT, async (req, res) => {
  await req.user.populate("purchasedCourses");

  res.json({ courses: req.user.purchasedCourses });
});

// GET /api/users/learning/:courseid
router.get("/users/learning/:courseid", verifyJWT, async (req, res) => {
  await req.user.populate("purchasedCourses");

  const courseArr = req.user.purchasedCourses.filter((item) => {
    return (
      JSON.stringify(new mongoose.Types.ObjectId(req.params.courseid)) ==
      JSON.stringify(item._id)
    );
  });

  if (courseArr.length == 0) {
    return res
      .status(403)
      .json({ message: "You need to purchase the course first." });
  }

  await courseArr[0].populate("instructor");
  await courseArr[0].populate("chapters");
  await courseArr[0].instructor.populate("instructorAccount");

  courseChapters = {
    coursename: courseArr[0].title,
    description: courseArr[0].description,
    courseinstructor: {
      name: courseArr[0].instructor.username,
      bio: courseArr[0].instructor.instructorAccount.bio,
      skills: courseArr[0].instructor.instructorAccount.skills,
    },
    chapters: courseArr[0].chapters,
  };

  res.json({ courseDetails: courseChapters });
});

module.exports = router;
