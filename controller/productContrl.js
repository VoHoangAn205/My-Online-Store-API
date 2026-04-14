const Product = require("../models/Product");

const getAllProductsContrl = async (req, res) => {
  const results = await Product.find();
  if (!results) {
    return res.status(204).json({ message: "No products found" });
  }
  res.json(results);
};

const createProductContrl = async (req, res) => {
  const { productName, category, price } = req?.body;
  if (!productName || !category || !price) {
    return res.status(400).json({ message: "your fields are required" });
  }
  console.log(req.body);

  try {
    const result = await Product.create({
      productName,
      category,
      price,
    });
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "cannot create product" });
  }
};

module.exports = {
  getAllProductsContrl,
  createProductContrl,
};
