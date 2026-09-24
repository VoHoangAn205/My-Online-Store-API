const express = require("express");
const router = express.Router();
const galleryContrl = require("../../controller/galleryContrl");
const multer = require("multer");
const storage = require("../../config/cloudinaryConfig");
const verifyRole = require("../../middleware/verifyRole");
const ROLE_LIST = require("../../config/roles_list");

const upload = multer({ storage: storage });

router.post(
  "/",
  verifyRole(ROLE_LIST.Salesman, ROLE_LIST.Admin),
  upload.array("images", 5),
  galleryContrl.uploadGallery,
);

router.delete("/:id", verifyRole(ROLE_LIST.Admin), galleryContrl.deleteGallery);

router.put(
  "/removeImage/:id",
  verifyRole(ROLE_LIST.Admin),
  galleryContrl.removeImageFromGallery,
);

router.put(
  "/addNewImage/:id",
  verifyRole(ROLE_LIST.Admin),
  upload.single("image"),
  galleryContrl.addImageToGallery,
);

module.exports = router;
