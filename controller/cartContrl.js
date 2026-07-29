const Cart = require("../models/Cart");
const Product = require("../models/Product");

const getCart = async (req, res) => {
  try {
    const user = req.userId;

    const result = await Cart.findOne({ user })
      .populate({
        path: "cartItems.product",
        select: "name price gallery status stock",
        populate: { path: "gallery", select: "images url" },
      })
      .exec();

    if (!result) {
      return res.status(200).json({ cartItems: [] });
    }

    res.status(200).json(result);
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ message: "Server cannot fetching Cart", error: err.message });
  }
};

const updateCart = async (req, res) => {
  try {
    const user = req.userId;
    const product = req.body.product;
    const quantity = parseInt(req.body.quantity) || 1;

    const foundProduct = await Product.findById(product).exec();

    if (!foundProduct) {
      return res.status(404).json("Cannot found this product");
    }

    const cart = await Cart.findOne({ user })
      .populate({
        path: "cartItems.product",
        select: "name price gallery status stock",
        populate: { path: "gallery", select: "images url" },
      })
      .exec();
    if (!cart) {
      const createCart = await Cart.create({
        user,
        cartItems: [{ product, quantity }],
      });
      return res.status(200).json(createCart);
    }

    const indexCart = cart.cartItems.findIndex(
      (item) => item.product._id.toString() === product,
    );

    if (indexCart > -1) {
      cart.cartItems[indexCart].quantity += quantity;
    } else {
      cart.cartItems.push({ product, quantity });
    }

    const result = await cart.save();

    res.status(200).json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server cannot update Cart" });
  }
};

const deleteCart = async (req, res) => {
  try {
    const user = req.userId;
    const product = req.params.id;

    const updateCart = await Cart.findOneAndUpdate(
      { user },
      { $pull: { cartItems: { product } } },
      { returnDocument: "after" },
    ).populate({
      path: "cartItems.product",
      select: "name price gallery status stock",
      populate: { path: "gallery", select: "images url" },
    });

    if (!updateCart) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updateCart);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server cannot delete Cart" });
  }
};

module.exports = { getCart, updateCart, deleteCart };
