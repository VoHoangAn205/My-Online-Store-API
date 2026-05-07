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
module.exports = { uploadImage };
