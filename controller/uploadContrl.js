const Image = require("../models/Image");

const uploadImage = async (req, res) => {
  try {
    const { path, filename } = req.file;

    const result = await Image.create({
      url: path,
      public_id: filename,
    });

    res.status(201).json({
      message: "Image uploaded successfully",
      result,
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
    console.log("controller's log: ", images);

    // const results = Image.create(images)
    res
      .status(200)
      .json({ message: "Images uploaded successfully", data: images });
  } catch (err) {
    res.status(500).json({ message: "upload failed", error: err.message });
  }
};
module.exports = { uploadImage, uploadGallery };
