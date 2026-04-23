const Category = require("../models/Category");

const getAllCategory = async (req, res) => {
  const result = await Category.findOne().exec();
};

const createCategory = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res
      .status(400)
      .json({ message: "your caregory's name is required" });
  }

  const duplicate = await Category.findOne({ name: { $eq: name } });

  if (duplicate)
    return res.status(409).json({ message: "this category are existed" });

  const result = await Category.create({ name });
  return res.status(201).json({ message: "your category created", result });
};

module.exports = {
  createCategory,
};
