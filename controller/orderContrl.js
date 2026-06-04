const sendEmail = require("../config/emailConfig");
const { Order, SubOrder } = require("../models/Order");
const Product = require("../models/Product");

const createOrder = async (req, res) => {
  try {
    const cartItems = req.body.cartItems;
    const user = req.userId;
    let totalPrice = 0;
    let groupProduct = {};
    // mapping product's id
    const itemIds = cartItems.map((item) => item.productId);

    const foundProducts = await Product.find({
      _id: { $in: itemIds },
    })
      .select("name price user")
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

      const shopId = product.user;
      const totalItem = product.price * item.quantity;
      totalPrice += totalItem;

      if (!groupProduct[shopId]) {
        groupProduct[shopId] = {
          shopId,
          parentOrder,
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

    res
      .status(200)
      .json({ message: "order create successful", data: subOrder });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Create order failed", error: err.message });
  }
};

module.exports = { createOrder };
