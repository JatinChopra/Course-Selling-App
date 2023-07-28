const express = require("express");
const router = express.Router();
const verifyJWT = require("../middlewares/verifyJWT");
const validator = require("validator");

// import models and mongoose
const mongoose = require("mongoose");
const courseModel = require("../models/courseModel");
const instructorModel = require("../models/instructorModel");

// helper functions

// isAplhaNum(value) : check if value is alpha numeric , spaces(optional)
const isAlphaNum = (value) => {
  return validator.isAlphanumeric(value, validator.isAlphanumericLoacles, {
    ignore: " ",
  });
};

// sendResponse(status,message) : sends a response to the client with specified status
// code and message
const sendResponse = (status, message) => {
  return res.status(status).json({
    message: message,
  });
};

// courseFieldValidator(title,description,price) => validates the value of course fields and
// if they contains invalid characters then handle the response itself
const courseFieldsValidator = ({ title, description, price }) => {
  let responseSent = false;

  // only check if the specified fiels are there
  if (title && !isAlphaNum(title)) {
    // validate the title of course
    responseSent = true;
    return sendResponse(
      400,
      "Title could only contain alphanumeric characters"
    );
  }

  if (description && !isAlphaNum(description)) {
    // validate the description of the cours
    responseSent = true;
    return sendResponse(
      400,
      "Description could only contain alphanumeric characters"
    );
  }

  if (price && !validator.isFloat(price)) {
    // validate the price of course
    responseSent = true;
    return sendResponse(400, "Provide valid value course price");
  }

  // returns if response was handeled by this function or not
  return responseSent;
};

// Routes
// GET /api/courses: Get a list of available courses.
router.get("/courses", async (req, res) => {
  try {
    const courses = await courseModel.find({}); // fetch the courses from the db
    res.json({ courses });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// GET /api/courses/:id: Get details of a specific course.
router.get("/courses:id", async (req, res) => {
  let id = req.params.id; // extract the course id
  try {
    const course = await courseModel.findOne({ _id: id }); // fetch the specific course
    return res.json({ course });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server error occured while fetcing a course details",
    });
  }
});

// POST /api/courses: Create a new course (requires authentication as an instructor).
router.post("/courses", verifyJWT, async (req, res) => {
  if (req.user.isInstructor) {
    // verify if the current user is an instructor or not

    // destructure the request body
    const { title, description, price } = req.body;

    // make sure the fields are not emtpy since all of them are required
    if (!title || !description || !price) {
      return res
        .status(400)
        .json({ message: "Please fill the required fields." });
    }

    const responseSent = courseFieldsValidator({ title, description, price }); //validate the new course fields

    if (!responseSent) {
      // if response is not alreayd handled by the helper function then proceed further

      // create a new course document
      const newCourse = new courseModel({
        ...req.body,
        instructor: req.user._id,
      });

      // save the course document in the collection
      const courseSaveResult = await newCourse.save();

      // fetch the instructor document
      const instructorInstance = await instructorModel.findOne({
        _id: req.user.instructorAccount._id,
      });

      // update the coursesOffered in instructor document
      instructorInstance.coursesOffered.push(courseSaveResult._id);

      // save the updated instructor document
      await instructorInstance.save();

      res.json({ message: "Course added successfully" });
    }
  } else {
    res
      .status(403)
      .json({ message: "You need to be an instructor to create a course" });
  }
});

// PUT /api/courses/:id: Update course details (requires jwt token and need to be an instructor).
router.put("/courses/:id", verifyJWT, async (req, res) => {
  const courseDoc = await courseModel.findOne({ _id: req.params.id }); // fetch the couse document by id

  // verify
  // 1- if current user is an instructor
  // 2- if the courseinstructor id is equal to current instructor id
  if (
    req.user.isInstructor &&
    JSON.stringify(req.user._id) === JSON.stringify(courseDoc.instructor)
  ) {
    const responseSent = courseFieldsValidator(req.body); // validate the new info
    if (!responseSent) {
      // proceed further if response was not handled by the helper function
      try {
        // make changes to the db
        const updatedCourse = await courseModel.findOneAndUpdate(
          { _id: req.params.id },
          req.body
        );

        // return the success message
        if (updatedCourse) {
          return res.json({ message: "Course updated successfully" });
        }
      } catch (e) {
        // handle any error ocured while updating the course
        return res
          .status(500)
          .json({ message: "Internal server error while updating a course" });
      }
    }
  } else {
    // send 403 if user is not an instructor
    res.status(403).json({ message: "You cannot update this course" });
  }
});

// DELETE /api/courses/:id: Delete a course (requires authentication as an instructor)
// detetes a course and also remove the course entry from the instructor object
router.delete("/courses/:id", verifyJWT, async (req, res) => {
  // fetch the course object with populated instructor document
  const courseDoc = await courseModel
    .findOne({ _id: req.params.id })
    .populate("instructor"); // fetch user document which was used to create the course

  // before updating the course
  // check if
  // the course instructor id and user id is same
  if (
    req.user.isInstructor &&
    JSON.stringify(req.user._id) === JSON.stringify(courseDoc.instructor._id)
  ) {
    try {
      // get the instructor object from the user document instructor account id
      const instructor = await instructorModel.findOne({
        _id: courseDoc.instructor.instructorAccount,
      });

      // go through the instructor documetn courseOffered array and filter it ( removing the current course objectId from the array)
      const updatedCoursesOffered = instructor.coursesOffered.filter((item) => {
        return JSON.stringify(item._id) !== JSON.stringify(courseDoc._id);
      });

      // save the instructor document with updated courseOffered array
      instructor.coursesOffered = updatedCoursesOffered;
      const result = await instructor.save();

      // now find the course and remoe it from database
      await courseModel
        .findOneAndRemove({
          _id: req.params.id,
        })
        .exec();
      res.json({ message: "Course deleted successfully" }); // send a op success message
    } catch (e) {
      return res
        .status(500)
        .json({ message: "Server Error while deleting a course data" });
    }
  } else {
    res
      .status(403)
      .json({ message: "You done have permission to delete this course" });
  }
});

module.exports = router;
