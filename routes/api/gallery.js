const express = require("express");
const router = express.Router();
const galleryContrl = require("../../controller/galleryContrl");
const multer = require("multer");
const storage = require("../../config/cloudinaryConfig");

const upload = multer({ storage: storage });

router.post("/", upload.array("images", 5), galleryContrl.uploadGallery);

router.delete("/:id", galleryContrl.deleteGallery);

router.put("/removeImage/:id", galleryContrl.removeImageFromGallery);

router.put(
  "/addNewImage/:id",
  upload.single("image"),
  galleryContrl.addImageToGallery,
);

module.exports = router;
