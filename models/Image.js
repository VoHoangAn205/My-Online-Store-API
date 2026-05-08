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

module.exports = mongoose.model("Image", imageSchema);

const gallerySchema = new Schema({
  images: [{ imageSchema }],
});

module.export = mongoose.model("Gallery", gallerySchema);
