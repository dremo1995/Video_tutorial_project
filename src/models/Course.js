const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true, maxLength: 1000 },
  imageUrl: { type: String, required: true },
  isPublic: { type: Boolean, default: false },
  createAt: { type: String },
  usersEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  creatorId: { type: String, required: true },
});

module.exports = mongoose.model("Course", courseSchema);
