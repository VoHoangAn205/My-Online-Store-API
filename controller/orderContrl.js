const { sendEmail, sendBackgroundOrderEmail } = require("../helper/sendEmail");
const renderHtmlEmailItem = require("../helper/renderHtmlEmailItem");
const { Order, SubOrder } = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

const createOrder = async (req, res) => {
  try {
    const cartItems = req.body.cartItems;
    const user = req.userId;
    const username = req.user;
    let totalPrice = 0;
    let groupProduct = {};
    // mapping product's id
    const itemIds = cartItems.map((item) => item.productId);

    const findUser = await User.findById(user).select("email").exec();

    const foundProducts = await Product.find({
      _id: { $in: itemIds },
    })
      .select("name price user")
      .populate("user", "username email")
      .lean()
      .exec();

    if (foundProducts.length !== itemIds.length) {
      return res
        .status(400)
        .json({ message: "Cannot find products or some product are missing" });
    }

    // create parent order
    const parentOrder = await Order.create({ user });

    for (const item of cartItems) {
      const product = foundProducts.find(
        (product) => product._id.toString() === item.productId,
      );

      if (!product) {
        return res
          .status(400)
          .json({ message: `product '${item.productId}' not found` });
      }

      const shopId = product.user._id;
      const shopName = product.user.username;
      const shopEmail = product.user.email;
      const totalItem = product.price * item.quantity;
      totalPrice += totalItem;

      if (!groupProduct[shopId]) {
        groupProduct[shopId] = {
          shopId,
          parentOrder,
          historicalShopSnapshot: {
            username: shopName,
            email: shopEmail,
          },
          subTotalPrice: 0,
          orderItems: [],
        };
      }

      groupProduct[shopId].subTotalPrice += totalItem;
      groupProduct[shopId].orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });
    }

    const finalOrderItem = Object.values(groupProduct);
    // create subOrder
    const subOrder = await SubOrder.create(finalOrderItem);

    const subOrderIds = subOrder.map((sub) => sub._id);
    // update parent order
    const result = await Order.findByIdAndUpdate(
      parentOrder._id,
      {
        totalPrice,
        $push: { subOrders: { $each: subOrderIds } },
      },
      { returnDocument: "after" },
    );

    sendBackgroundOrderEmail(
      username,
      findUser.email,
      totalPrice,
      finalOrderItem,
    );
    res.status(200).json(subOrder);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Create order failed", error: err.message });
  }
};

const getAllParentOrder = async (req, res) => {
  try {
    const user = req.userId;

    const result = await Order.find({ user }).populate("subOrders").exec();

    if (!result) {
      return res.status(400).json({ message: "Cannot find your order" });
    }

    res.status(200).json({ data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Get orders failed", error: err.message });
  }
};

const getAllSubOrder = (req, res) => {};

module.exports = { createOrder, getAllParentOrder };
