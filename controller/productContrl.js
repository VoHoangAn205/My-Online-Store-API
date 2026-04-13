const Product = require("../models/Product");

const getAllProductsContrl = async (req, res) => {
  const results = await Product.find();
  if (!results) {
    return res.status(204).json({ message: "No products found" });
  }
  res.json(results);
};

const createProductContrl = async (req, res) => {
  const { productName, category, price, date } = req?.body;
};

module.exports = {
  getAllProductsContrl,
};
