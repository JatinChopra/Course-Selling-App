const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  videourl: { type: String, required: true },
});

const chapterModel = mongoose.model("Chapter", chapterSchema);

module.exports = chapterModel;
