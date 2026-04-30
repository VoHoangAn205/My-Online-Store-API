const uploadImage = async (req, res) => {
  console.log("into upload controller");

  const file = req?.file;
  try {
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

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
