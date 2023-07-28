const express = require("express");
const router = express.Router();
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const mongoose = require("mongoose");

// import secret keys and other configurations
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

// import db models
const userModel = require("../models/userModel");
const instructorModel = require("../models/instructorModel");

// import middlewares
const verifyJWT = require("../middlewares/verifyJWT");

// Helper functions

// signupValidator : for performaing validation checks on the signup form fields
const signupValidator = async (res, username, email, password) => {
  let responseSent = false; // initially set to false

  // function for sending response with specified statuscode and message in case the form data in invalid
  const sendResponse = (statusCode, message) => {
    responseSent = true; // set response sent to true
    return res.status(statusCode).json({ message: message });
  };

  // make sure every field is filled
  if (username.length === 0 || email.length === 0 || password.length === 0) {
    return sendResponse(400, "Please fill all the required fields.");
  }

  // username must only contain alphanumeric values
  if (!validator.matches(username, "^[a-zA-Z0-9_.-]*$")) {
    return sendResponse(
      400,
      "Username can only consist of alphanumeric values"
    );
  }

  // validate the email address
  if (!validator.isEmail(email)) {
    return sendResponse(400, "Please Provide a valid email address");
  }

  // check if username or email is already taken
  try {
    // fetch document with specific username from users collection
    const existingUsername = await userModel.findOne({ username: username });
    if (existingUsername) {
      return sendResponse(403, "Username alreausernamedy taken");
    }

    // fetch document with specific email from users collection
    const existingEmail = await userModel.findOne({ email: email });
    if (existingEmail) {
      return sendResponse(403, "Email already taken");
    }
  } catch (err) {
    // handle any error while trying to fetch data from mongo db instance
    return sendResponse(500, "Internal Error while validating signup form");
  }

  // return a variable indication if response was handled by this function or not
  return responseSent;
};

// POST /api/auth/signup: Create a new user account
// Response : message with JWT token
router.post("/signup", async (req, res) => {
  // destructure the request body
  const { username, email, password } = req.body;
  // call the signup validator on the fields
  const responseSent = await signupValidator(res, username, email, password);

  // proceed if response is not already handled by the helper function
  if (!responseSent) {
    try {
      // create a hashed password
      hashedPassword = await bcrypt.hash(password, saltRounds);

      // create a new user model
      const newUser = new userModel({
        username: username,
        email: email,
        password: hashedPassword,
        purchasedCourses: [],
      });

      // save the changes to db
      const result = await newUser.save();

      // sign a jwt token with username and id as payload
      const token = jwt.sign(
        {
          username: result["username"],
          id: result["_id"],
        },
        JWT_SECRET,
        { algorithm: "HS256" }
      );

      // send token in response with a success message
      res.json({ message: "User Created Successfully", token: token });
    } catch (Err) {
      // handle any error by sending status code of 500 with a message
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
});

// POST /api/auth/login: Logs in a user
// Response : message with JWT token
router.post("/login", async (req, res) => {
  // destructure request body and to get email and password
  const { email, password } = req.body;

  // validate if email format is correct
  if (!validator.isEmail(email)) {
    return res
      .status(400)
      .json({ message: "Please provide a valid email address." });
  }

  // find the document with corresponding username in db
  const userFound = await userModel.findOne({ email: email });

  // procees with other checks if the user document was found in the collection
  if (userFound) {
    try {
      // compare the password with the hashed password
      const result = await bcrypt.compare(password, userFound["password"]);

      // if result is true then generate a jwt token and send to user along with success message
      if (result) {
        // create and send the token
        const token = jwt.sign(
          {
            username: userFound["username"],
            id: userFound["_id"],
          },
          JWT_SECRET,
          { algorithm: "HS256" }
        );

        return res.json({ message: "Logged in successfully", token: token });
      } else {
        res.status(403).json({ message: "Email or password incorrect" });
      }
    } catch (err) {
      // for handling any kind of error that may occur while dealing with
      // siginig of token or fetching data from db or comparing hash with password
      return res
        .status(500)
        .json({ message: "Internal server Error" + err.message });
    }
  } else {
    res.status(403).json({ message: "Email id not found." });
  }
});

// 	POST /api/instructors/apply: Submit details to become an instructor (requires authentication).
//  Response  : a success message or an error
router.post("/instructor/apply", verifyJWT, async (req, res) => {
  if (req.user.isInstructor) {
    return res.json({ message: "Already an instructor" });
  }

  try {
    const instructorData = new instructorModel(req.body);
    await instructorData.save();

    // find and update the user object
    await userModel.findOneAndUpdate(
      { _id: req.user._id },
      {
        isInstructor: true,
        instructorAccount: instructorData,
      }
    );

    res.json({ message: "You have successfully registered as an instructor." });
  } catch (Err) {
    res.status(500).json({
      message: "Server Error occured while performing the operation",
    });
  }
});

// export the router instance
module.exports = router;
