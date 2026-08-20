const Category = require("../models/Category");

const getAllCategory = async (req, res) => {
  try {
    const data = await Category.find().select("name  emoji").exec();

    if (!data) return res.status(200).json([]);

    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching categories: ", err.message);
    res.status(500).json({
      message: "Server Error fetching categories",
      error: err.message,
    });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, emoji } = req.body;
    const userId = req.userId;

    const duplicate = await Category.findOne({ name: { $eq: name } }).exec();

    if (duplicate) {
      return res.status(409).json({ message: "this category are existed" });
    }

    const result = await Category.create({ name, emoji, user: userId });
    res.status(201).json(result);
  } catch (err) {
    console.error("Create category failed: ", err.message);
    res.status(500).json({
      message: "Server cannot create category",
      error: err.message,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await Category.findByIdAndDelete(id);

    if (!result) {
      return res
        .status(404)
        .json({ message: "Cannot found and delete this category" });
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Delete category failed: ", err.message);
    res.status(500).json({
      message: "Server cannot delete category",
      error: err.message,
    });
  }
};

module.exports = {
  getAllCategory,
  createCategory,
  deleteCategory,
};
