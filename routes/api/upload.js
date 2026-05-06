const express = require("express");
const router = express.Router();
const uploadContrl = require("../../controller/uploadContrl");
const multer = require("multer");
const storage = require("../../config/cloudinaryConfig");
const imageValidate = require("../../validations/imageValidate");
const validateBody = require("../../middleware/validateBody");

const upload = multer({ storage: storage });

router
  .route("/")
  .post(
    upload.single("image"),
    validateBody(imageValidate.uploadImage),
    uploadContrl.uploadImage,
  );

module.exports = router;
