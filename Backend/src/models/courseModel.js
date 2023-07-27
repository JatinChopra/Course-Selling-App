const mongoose = require("mongoose");
const { Schema } = mongoose;

courseSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  instructor: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
