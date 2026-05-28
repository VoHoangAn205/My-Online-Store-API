const Order = require("../models/Order");
const Product = require("../models/Product");

const createOrder = async (req, res) => {
  try {
    const cartItems = req.body.cartItems;
    const user = req.userId;
    // mapping product's id
    const itemIds = cartItems.map((item) => item.productId);

    const foundProducts = await Product.find({
      _id: { $in: itemIds },
    })
      .select("name price")
      .exec();

    if (foundProducts.length !== itemIds.length) {
      return res.status(400).json({ message: "cannot find product" });
    }

    // add quantity to product info
    const orderItems = cartItems.map((cartItem) => {
      const product = foundProducts.find(
        (product) => product._id.toString() === cartItem.productId,
      );

      if (product) {
        return { ...product.toObject(), quantity: cartItem.quantity };
      }
    });

    const totalPrice = cartItems.reduce((sum, cartItem) => {
      const product = foundProducts.find(
        (product) => product._id.toString() === cartItem.productId,
      );

      if (product) return sum + product.price * cartItem.quantity;

      return sum;
    }, 0);

    const data = { user, totalPrice, orderItems };
    const result = await Order.create(data);

    res.status(200).json({ message: "order create successful", data: result });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Create order failed", error: err.message });
  }
};

module.exports = { createOrder };
