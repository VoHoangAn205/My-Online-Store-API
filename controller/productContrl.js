const Product = require("../models/Product");

const getAllProductsContrl = async (req, res) => {
  try {
    const results = await Product.find()
      .populate("category", "name")
      .populate("gallery")
      .populate("user", "username")
      .exec();

    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching products: ", err.message);
    res
      .status(500)
      .json({ message: "Server Error fetching product", error: err });
  }
};

const getProductById = async (req, res) => {
  try {
    const result = await Product.findById(req.params.id)
      .populate("category", "name")
      .populate("gallery")
      .populate("user", "username")
      .exec();

    if (!result) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching product: ", err.message);
    res
      .status(500)
      .json({ message: "Server Error fetching product", error: err });
  }
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
    res.status(500).json({ message: "Cannot create product", error: err });
  }
};

const updateProductContrl = async (req, res) => {
  const id = req.params.id;
  const body = req.body;

  try {
    const result = Product.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).exec();
  } catch (err) {
    console.error("cannot update product: ", err.message);
  }
};

module.exports = {
  getAllProductsContrl,
  getProductById,
  createProductContrl,
  updateProductContrl,
};
