const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
require("dotenv").config();

const verifyJWT = async (req, res, next) => {
  // verify the token
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    let decoded = "";
    decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findOne({ username: decoded.username });
    //attach the user object and pass it
    req.user = user;
  } catch (Err) {
    console.log(Err.message);
    return res.status(403).json({ message: "Invalid JWT Token" });
  }
  next();
};

module.exports = verifyJWT;
