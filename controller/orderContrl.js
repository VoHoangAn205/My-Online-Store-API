const { sendEmail, sendBackgroundOrderEmail } = require("../helper/sendEmail");
const renderHtmlEmailItem = require("../helper/renderHtmlEmailItem");
const { Order, SubOrder } = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const getSortCriteria = require("../utils/getSortCriteria");
const ORDERSTATUS_LIST = require("../config/orderStatus_list");

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

    const vendorEmailData = {};

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
          subTotalPrice: 0,
          orderItems: [],
        };

        vendorEmailData[shopId] = {
          shopEmail,
          shopName,
          orderItems: [],
          subTotalPrice: 0,
        };
      }

      groupProduct[shopId].subTotalPrice += totalItem;
      groupProduct[shopId].orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });

      vendorEmailData[shopId].subTotalPrice += totalItem;
      vendorEmailData[shopId].orderItems.push({
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });
    }

    const finalOrderItem = Object.values(groupProduct);
    const vendorData = Object.values(vendorEmailData);
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
      vendorData,
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

    const result = await Order.find({ user })
      .populate({
        path: "subOrders",
        populate: {
          path: "shopId user",
          select: "username",
        },
      })
      .exec();

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
      .populate("user shopId", "username")
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

const updateOrderStatusForShop = async (req, res) => {
  try {
    const shopId = req.userId;
    const subOrderId = req.params.id;

    const foundOrder = await SubOrder.findById(subOrderId).exec();

    if (!foundOrder)
      return res.status(404).json({ message: "This order is not exist" });
    // Authorization check
    if (foundOrder.shopId.toString() !== shopId) {
      return res
        .status(403)
        .json({ message: "You have not authorize to perform this action" });
    }

    const currentStatusIndex = ORDERSTATUS_LIST.indexOf(foundOrder.subStatus);
    const shippedIndex = ORDERSTATUS_LIST.indexOf("shipped");

    if (currentStatusIndex >= shippedIndex) {
      return res
        .status(400)
        .json({ message: "Unable to update to the next status" });
    }

    foundOrder.subStatus = ORDERSTATUS_LIST[currentStatusIndex + 1];

    const result = await foundOrder.save();

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Get orders failed", error: err.message });
  }
};

const updateOrderStatusForUser = async (req, res) => {
  try {
    const userId = req.userId;
    const subOrderId = req.params.id;

    const foundOrder = await SubOrder.findById(subOrderId).exec();

    if (!foundOrder)
      return res.status(404).json({ message: "This order is not exist" });
    // Authorization check
    if (foundOrder.user.toString() !== userId)
      return res
        .status(403)
        .json({ message: "You have not authorize to perform this action" });

    const currentStatusIndex = ORDERSTATUS_LIST.indexOf(foundOrder.subStatus);
    const shippedIndex = ORDERSTATUS_LIST.indexOf("shipped");

    if (currentStatusIndex !== shippedIndex)
      return res
        .status(400)
        .json({ message: "Unable to update to the next status" });

    foundOrder.subStatus = ORDERSTATUS_LIST[currentStatusIndex + 1];

    const result = await foundOrder.save();

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Get orders failed", error: err.message });
  }
};

const shopCancelOrder = async (req, res) => {
  try {
    const shopId = req.userId;
    const orderId = req.params.id;

    const foundOrder = await SubOrder.findById(orderId).exec();

    if (!foundOrder) {
      return res.status(404).json({ message: "This order is not exist" });
    }

    if (foundOrder.shopId.toString() !== shopId) {
      return res
        .status(403)
        .json({ message: "You have not authorize to perform this action" });
    }

    const currentStatusIndex = ORDERSTATUS_LIST.indexOf(foundOrder.subStatus);
    const shippedIndex = ORDERSTATUS_LIST.indexOf("shipped");
    const cancelledIndex = ORDERSTATUS_LIST.indexOf("cancelled");

    if (currentStatusIndex >= shippedIndex) {
      return res.status(400).json({
        message: "Cannot update status of shipped or cancelled order",
      });
    }

    foundOrder.subStatus = ORDERSTATUS_LIST[cancelledIndex];

    const result = await foundOrder.save();

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Get orders failed", error: err.message });
  }
};

const userCancelOrder = async (req, res) => {
  try {
    const user = req.userId;
    const orderId = req.params.id;

    const foundOrder = await SubOrder.findById(orderId).exec();

    if (!foundOrder)
      return res.status(404).json({ message: "This order is not exist" });

    if (foundOrder.user.toString() !== user) {
      return res
        .status(403)
        .json({ message: "You have not authorize to perform this action" });
    }

    const currentStatusIndex = ORDERSTATUS_LIST.indexOf(foundOrder.subStatus);
    const pendingIndex = ORDERSTATUS_LIST.indexOf("pending");
    const cancelledIndex = ORDERSTATUS_LIST.indexOf("cancelled");

    if (currentStatusIndex > pendingIndex) {
      return res
        .status(400)
        .json({ message: "This order has been handed over to the carrier" });
    }

    foundOrder.subStatus = ORDERSTATUS_LIST[cancelledIndex];

    const result = await foundOrder.save();

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Get orders failed", error: err.message });
  }
};

module.exports = {
  createOrder,
  getAllParentOrder,
  getSubOrder,
  updateOrderStatusForShop,
  updateOrderStatusForUser,
  shopCancelOrder,
  userCancelOrder,
};
