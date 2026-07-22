const Cart = require("../models/Cart");
const Product = require("../models/Product");

const getCart = async (req, res) => {
  try {
    const user = req.userId;

    const result = await Cart.findOne({ user })
      .populate({
        path: "cartItems.productId",
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
    const { productId, quantity = 1 } = req.body;

    const foundProduct = await Product.findById(productId).exec();

    if (!foundProduct) {
      return res.status(404).json("Cannot found this product");
    }

    const cart = await Cart.findOne({ user }).exec();

    if (!cart) {
      const createCart = await Cart.create({
        user,
        cartItems: [{ productId, quantity }],
      });
      return res.status(200).json(createCart);
    }

    const indexCart = cart.cartItems.findIndex(
      (item) => item.productId.toString() === productId,
    );

    console.log(indexCart);
    console.log("abcd");

    if (indexCart > -1) {
      cart.cartItems[indexCart].quantity += Number(quantity);
    } else {
      cart.cartItems.push({ productId, quantity });
    }

    const result = await cart.save();

    res.status(200).json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server cannot update Cart" });
  }
};

module.exports = { getCart, updateCart };
