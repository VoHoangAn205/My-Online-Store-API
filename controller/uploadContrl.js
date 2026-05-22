const cloudinary = require("cloudinary").v2;
const { Image } = require("../models/Upload");

const uploadImage = async (req, res) => {
  try {
    const { path, filename } = req.file;
    if (!path || !filename) {
      return res
        .status(400)
        .json({ message: "Your image's file is required or invalid" });
    }

    const result = await Image.create({
      url: path,
      public_id: filename,
    });

    res.status(201).json({
      message: "image uploaded successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
};

const deleteImage = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }
    const foundImage = await Image.findById(id).exec();

    if (!foundImage) {
      return res.status(400).json({ message: "This image is not exist" });
    }

    await cloudinary.uploader.destroy(foundImage.public_id);
    const result = await Image.findByIdAndDelete(id);

    res.status(200).json({ message: "Delete Image susseccful", data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};

module.exports = {
  uploadImage,
  deleteImage,
};
