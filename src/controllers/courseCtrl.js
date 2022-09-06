const fs = require("fs");
const { parse } = require("json2csv");
const asyncHandler = require("express-async-handler");
const path = require("path");
const Course = require("../models/Course");
const { validationResult } = require("express-validator");
const User = require("../models/User");

exports.getHome = asyncHandler(async (req, res) => {
  console.log("Get Home");
  const user = req.session.user;

  let courses = await Course.find({});

  if (req.session.isLoggedIn) {
    courses = courses.filter(
      (c) => c.isPublic == true || c.creatorId == user._id
    );
    console.log(courses);
  } else {
    courses = courses
      .filter((c) => c.isPublic == true)
      .sort((a, b) => b.usersEnrolled.length - a.usersEnrolled.length)
      .slice(0, 3);
    console.log(courses);
  }

  if (req.query.search) {
    courses = courses.filter((course) =>
      course.title.toLowerCase().includes(req.query.search.toLowerCase())
    );
  }
  res.render("home.hbs", { title: "Home Page", courses, user });
});

exports.getCreate = async (req, res) => {
  console.log("Get Create");
  const user = req.session.user;
  res.render("create-course.hbs", { title: "Create Course", user });
};
exports.postCreate = async (req, res) => {
  console.log("Post Create");

  let { title, description, imageUrl, isPublic } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("create-course.hbs", {
      title: "Create Page",
      errorMessage: errors.array()[0].msg,
      title,
      description,
      imageUrl,
      isPublic,
    });
  }

  if (isPublic == "on") {
    isPublic = true;
  } else {
    isPublic = false;
  }

  const createAt = new Date().toString().split(" ").slice(0, 4).join(" ");

  const course = new Course({
    title,
    description,
    imageUrl,
    isPublic,
    createAt: createAt,
    creatorId: req.user._id,
  });
  await course.save();
  req.flash("success", "Course created successfully");
  res.redirect("/");
};

exports.getDetails = async (req, res) => {
  console.log("Get Details");
  const id = req.params.courseId;
  const course = await Course.findById(id);
  const user = req.user;

  let owner = false;
  if (req.user) {
    owner = req.user._id.toString() == course.creatorId;
  }

  const enrolled = user.enrolledCourses.filter((c) => c._id == id);
  console.log(enrolled);
  if (course) {
    res.render("course-details.hbs", {
      title: `Details | ${course.title}`,
      course,
      owner,
      user,
      enrolled,
    });
  }
};

exports.getEdit = async (req, res) => {
  console.log("Get Edit");
  const user = req.user;
  const courseId = req.params.courseId;
  const info = await Course.findById(courseId);
  res.render("edit-course.hbs", { title: "Edit Course", user, courseId, info });
};

exports.postEdit = asyncHandler(async (req, res) => {
  console.log("Post Edit");

  const courseId = req.params.courseId;
  let { title, description, imageUrl, isPublic } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const user = req.user;
    return res.render("edit-course.hbs", {
      title: "Edit Page",
      errorMessage: errors.array()[0].msg,
      title,
      description,
      imageUrl,
      isPublic,
      user,
    });
  }

  const course = await Course.findById(courseId);

  if (isPublic == "on") isPublic = true;
  else isPublic = false;

  course.title = title;
  course.description = description;
  course.imageUrl = imageUrl;
  course.isPublic = isPublic;

  await course.save();
  req.flash("success", "Course editted successfully");
  res.redirect("/");
});

exports.postDelete = asyncHandler(async (req, res) => {
  console.log("Post Delete");
  const courseId = req.params.courseId;
  await Course.findByIdAndDelete(courseId);
  req.flash("success", "Course deleted Successfully !");
  res.redirect("/");
});

exports.postEnroll = asyncHandler(async (req, res) => {
  console.log("Post Enroll");
  const userId = req.user;
  const courseId = req.params.courseId;

  await Course.updateOne(
    { _id: courseId },
    { $push: { usersEnrolled: userId } }
  );
  await User.updateOne(
    { _id: userId },
    { $push: { enrolledCourses: courseId } }
  );
  req.flash("success", "You are enrolled");
  res.redirect("/");
});
