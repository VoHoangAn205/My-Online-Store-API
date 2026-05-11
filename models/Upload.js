const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
  public_id: {
    type: String,
    required: true,
  },
});

const gallerySchema = new Schema({
  images: [imageSchema],
});

const Image = mongoose.model("Image", imageSchema);
const Gallery = mongoose.model("Gallery", gallerySchema);

module.exports = { Image, Gallery };
