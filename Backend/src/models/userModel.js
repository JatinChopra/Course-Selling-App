const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  isInstructor: { type: Boolean, require: true, default: false },
  purchasedCourses: [
    { type: Schema.Types.ObjectId, ref: "Course", required: true },
  ],
  instructorAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Instructor",
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
