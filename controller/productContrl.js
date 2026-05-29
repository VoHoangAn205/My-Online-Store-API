const Product = require("../models/Product");

const getAllProductsContrl = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const results = await Product.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("category", "name")
      .populate("gallery")
      .populate("user", "username")
      .exec();
    const totalProducts = await Product.countDocuments();

    res.status(200).json({
      count: results.length,
      totalPage: Math.ceil(totalProducts / limit),
      currentPage: page,
      data: results,
    });
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
    console.error(err);
    res
      .status(500)
      .json({ message: "Server Error fetching product", error: err });
  }
};

const getShopProducts = async (req, res) => {
  try {
    const shopId = req.params.shopId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const result = await Product.find({ user: shopId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();

    const totalProducts = await Product.countDocuments({ user: shopId });

    res.status(200).json({
      count: result.length,
      totalPage: Math.ceil(totalProducts / limit),
      currentPage: page,
      data: result,
    });
  } catch (err) {
    console.error(err.message);
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
  try {
    const id = req.params.id;
    const body = req.body;

    const foundProduct = await Product.findById(id).exec();

    if (!foundProduct)
      return res.status(404).json({ message: "This product is not exist" });

    const result = await Product.findByIdAndUpdate(id, body, {
      returnDocument: "after",
      runValidators: true,
    }).exec();

    res.status(200).json({ message: "Update successful", data: result });
  } catch (err) {
    console.error("Cannot update product: ", err.message);
    res.status(500).json({ message: "Cannot update product", error: err });
  }
};

const deleteProductContrl = async (req, res) => {
  try {
    const id = req.params.id;

    const foundProduct = await Product.findById(id).exec();

    if (!foundProduct) {
      return res.status(404).json({ message: "this product is not exist" });
    }

    const result = await Product.deleteOne(foundProduct).exec();

    res.status(200).json({ message: "product deleted successful" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Cannot delete product", error: err.message });
  }
};

module.exports = {
  getAllProductsContrl,
  getProductById,
  getShopProducts,
  createProductContrl,
  updateProductContrl,
  deleteProductContrl,
};
