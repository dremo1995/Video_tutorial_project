const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "courses" }],
});

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
});
module.exports = mongoose.model("User", userSchema);
