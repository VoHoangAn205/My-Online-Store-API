const express = require("express");
const router = express.Router();
const uploadContrl = require("../../controller/uploadContrl");
const multer = require("multer");
const storage = require("../../config/cloudinaryConfig");

const upload = multer({ storage: storage });

router.post("/image", upload.single("image"), uploadContrl.uploadImage);
router.post("/gallery", upload.array("images", 5), uploadContrl.uploadGallery);

module.exports = router;
