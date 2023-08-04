const mongoose = require("mongoose");
const { Schema } = mongoose;
const instructorModel = require("../models/instructorModel");

courseSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  // price: { type: Number, required: true },
  imageurl: { type: String, required: true },
  instructor: { type: Schema.Types.ObjectId, ref: "User", required: true },
  chapters: [{ type: Schema.Types.ObjectId, ref: "Chapter" }],
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
