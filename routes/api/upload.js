const express = require("express");
const router = express.Router();
const uploadContrl = require("../../controller/uploadContrl");
const multer = require("multer");
const storage = require("../../config/cloudinaryConfig");

const upload = multer({ storage: storage });

router.route("/").post(upload.single("image"), uploadContrl.uploadImage);

module.exports = router;
