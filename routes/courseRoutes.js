const express = require("express");
const router = express.Router();
const { isAuth } = require("../middlewares/isAuth");
const { courseValidation } = require("../validation/courseValidate");
const {
  getHome,
  getCreate,
  postCreate,
  getDetails,
  getEdit,
  postEdit,
  postDelete,
  postEnroll,
} = require("../controllers/courseCtrl");

router.get("/", getHome);
router.get("/course/create", isAuth, getCreate);
router.post("/course/create", isAuth, courseValidation(), postCreate);
router.get("/details/:courseId", isAuth, getDetails);
router.get("/edit/:courseId", isAuth, getEdit);
router.post("/edit/:courseId", isAuth, courseValidation(), postEdit);
router.post("/delete/:courseId", isAuth, postDelete);
router.post("/enroll/:courseId", isAuth, postEnroll);

module.exports = router;
