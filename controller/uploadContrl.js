const { Image, Gallery } = require("../models/Upload");

const uploadImage = async (req, res) => {
  try {
    const { path, filename } = req.file;
    if (!path || !filename) {
      return res
        .status(400)
        .json({ message: "your image's file is required or invalid" });
    }

    const result = await Image.create({
      url: path,
      public_id: filename,
    });

    res.status(201).json({
      message: "Image uploaded successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).json({ message: "upload failed", error: err.message });
  }
};

const uploadGallery = async (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const images = files.map((file) => ({
      url: file.path,
      public_id: file.filename,
    }));

    const results = await Gallery.create({ images });

    res
      .status(200)
      .json({ message: "gallery uploaded successfully", data: results.images });
  } catch (err) {
    res.status(500).json({ message: "upload failed", error: err.message });
  }
};
module.exports = { uploadImage, uploadGallery };
