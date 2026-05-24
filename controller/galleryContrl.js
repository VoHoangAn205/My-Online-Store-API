const cloudinary = require("cloudinary").v2;
const { Gallery } = require("../models/Upload");

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
      .json({ message: "gallery uploaded successfully", data: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
};

const addImageToGallery = async (req, res) => {
  try {
    const id = req.params.id;
    const { path, filename } = req.file;

    if (!path || !filename || !id) {
      return res.status(400).json({
        message: "Your image's file and gallery Id is required or invalid",
      });
    }

    // fine gallery
    const foundGallery = await Gallery.findById(id).exec();

    if (!foundGallery || foundGallery.images.length >= 5) {
      return res.status(404).json({
        message: "Gallery not found or Gallery cannot be more than five images",
      });
    }

    const result = await Gallery.findByIdAndUpdate(
      id,
      { $addToSet: { images: { url: path, public_id: filename } } },
      { returnDocument: "after" },
    ).exec();

    res.status(200).json({ message: "image added successful", result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

const removeImageFromGallery = async (req, res) => {
  try {
    const id = req.params.id;
    const { imageId } = req.body;

    if (!id || !imageId) {
      return res
        .status(400)
        .json({ message: "Gallery ID and image ID are required" });
    }
    // fine gallery
    const foundGallery = await Gallery.findById(id).exec();

    if (!foundGallery || foundGallery.images.length === 1) {
      return res.status(404).json({
        message: "Gallery not found or Gallery cannot be less than one image",
      });
    }
    // find image in to gallery
    const foundImage = foundGallery.images.find((img) =>
      img._id.equals(imageId),
    );

    if (!foundImage) {
      return res.status(404).json({ message: "This image does not exist" });
    }
    // delete image on cloudinary
    await cloudinary.uploader.destroy(foundImage.public_id);
    // delete image in to gallery
    const result = await Gallery.findByIdAndUpdate(
      id,
      { $pull: { images: { _id: imageId } } },
      { returnDocument: "after" },
    ).exec();

    res.status(200).json({ message: "image removed successful", result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

const deleteGallery = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }
    const foundGallery = await Gallery.findById(id).exec();

    if (!foundGallery) {
      return res.status(404).json({ message: "This image is not exist" });
    }

    const dataMapping = foundGallery.images.map((image) => {
      return image.public_id;
    });

    await cloudinary.api.delete_resources(dataMapping);
    const result2 = await Gallery.findByIdAndDelete(id).exec();

    res
      .status(200)
      .json({ message: "Delete Gallery susseccful", data: result2 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};

module.exports = {
  uploadGallery,
  deleteGallery,
  removeImageFromGallery,
  addImageToGallery,
};
