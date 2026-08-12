const { sendEmail, sendBackgroundOrderEmail } = require("../helper/sendEmail");
const renderHtmlEmailItem = require("../helper/renderHtmlEmailItem");
const { Order, SubOrder } = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const getSortCriteria = require("../utils/getSortCriteria");

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
          user,
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
      return res.status(200).json([]);
    }

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Get orders failed", error: err.message });
  }
};

const getSubOrder = async (req, res) => {
  try {
    const shopId = req.userId;
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const status = req.query.status || "all";
    const configSort = getSortCriteria(req.query.sort);
    const skip = (page - 1) * limit;

    const filter = { shopId };
    if (status !== "all") filter.subStatus = status;

    const results = await SubOrder.find(filter)
      .limit(limit)
      .skip(skip)
      .sort(configSort)
      .populate("user", "username email")
      .exec();

    const totalProducts = await SubOrder.countDocuments(filter);

    if (!results) {
      return res.status(200).json([]);
    }

    res.status(200).json({
      count: totalProducts,
      totalPage: Math.ceil(totalProducts / limit),
      currentPage: page,
      data: results,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Get orders failed", error: err.message });
  }
};

// const updateOrderStatus = (req, res) => {
//   const shopId = req.userId;
//   const status = req.body.status
// };

module.exports = { createOrder, getAllParentOrder, getSubOrder };
