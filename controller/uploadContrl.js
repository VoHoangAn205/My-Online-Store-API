const Image = require("../models/Image");

const uploadImage = async (req, res) => {
  const file = req?.file;
  try {
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { path, filename } = file;

    const result = await Image.create({
      url: path,
      public_id: filename,
    });

    res.status(200).json({
      message: "Image uploaded successfully",
      url: file.path,
      public_id: file.filename,
    });
  } catch (err) {
    res.status(500).json({ message: "upload failed", error: err.message });
  }
};
module.exports = { uploadImage };
