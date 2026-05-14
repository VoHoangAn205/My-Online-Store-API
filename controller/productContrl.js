const Product = require("../models/Product");

const getAllProductsContrl = async (req, res) => {
  const results = await Product.find();
  if (!results) {
    return res.status(204).json({ message: "No products found" });
  }
  res.json(results);
};

const createProductContrl = async (req, res) => {
  const body = req.body;
  const user = req.userId;
  const data = { ...body, user };

  try {
    const result = await Product.create(data);
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "cannot create product", error: err });
  }
};

module.exports = {
  getAllProductsContrl,
  createProductContrl,
};
