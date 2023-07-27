const mongoose = require("mongoose");
const { Schema } = mongoose;

const instructorSchema = new Schema({
  bio: { type: String, required: true },
  skills: { type: Array },
  coursesOffered: [
    { type: Schema.Types.ObjectId, ref: "Course", required: true },
  ],
});

const instructorModel = mongoose.model("Instructor", instructorSchema);

module.exports = instructorModel;
