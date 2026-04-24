const Category = require("../models/Category");

const getAllCategory = async (req, res) => {
  const data = await Category.find().exec();
  if (!data) return res.sendStatus(403);
  return res.status(200).json({ data });
};

const createCategory = async (req, res) => {
  const { name } = req.body;
  const userId = req.userId;

  if (!name) {
    return res
      .status(400)
      .json({ message: "your caregory's name is required" });
  }

  const duplicate = await Category.findOne({ name: { $eq: name } }).exec();

  if (duplicate) {
    return res.status(409).json({ message: "this category are existed" });
  }

  try {
    const result = await Category.create({ name, user: userId });
    return res.status(201).json({ message: "your category created", result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "cannot create category" });
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.body;

  if (!id) return res.status(400).json({ message: "your ID is required" });

  const foundCategory = await Category.findById(id);

  if (!foundCategory) {
    return res.status(404).json({ message: "cannot found category" });
  }

  const result = await Category.deleteOne({ _id: id });
  return res.sendStatus(200);
};

module.exports = {
  getAllCategory,
  createCategory,
  deleteCategory,
};
