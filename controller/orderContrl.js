const sendEmail = require("../config/emailConfig");
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
          user: shopId,
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

    const emailHtmlForClient = `<div class="email-container" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05); border: 1px solid #e1e4e8;">
        
        <!-- Header -->
        <div class="header" style="background-color: #00875a; padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; font-size: 24px; margin: 0; font-weight: 600;">Thank You for Your Purchase!</h1>
        </div>

        <!-- Content -->
        <div class="content" style="padding: 40px 30px; line-height: 1.6;">
            <p style="margin: 0 0 10px 0; font-size: 16px; color: #4a4a4a;">Hi ${username}</p>
            <p style="margin: 0 0 25px 0; font-size: 16px; color: #4a4a4a;">We've received your order and are getting it ready. You will receive another email with your tracking information as soon as your package ships.</p>

            <!-- Order Summary Title -->
            <h3 style="margin: 0 0 15px 0; font-size: 18px; color: #253858; border-bottom: 2px solid #f4f5f7; padding-bottom: 8px;">Order Details <span style="font-size: 14px; color: #7a869a; font-weight: normal;">(#${parentOrder._id})</span></h3>

            <!-- Item Table -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 15px;">
                <thead>
                    <tr style="border-bottom: 1px solid #e1e4e8; text-align: left;">
                        <th style="padding: 8px 0; color: #7a869a; font-weight: 600;">Item</th>
                        <th style="padding: 8px 0; color: #7a869a; font-weight: 600; text-align: center;">Qty</th>
                        <th style="padding: 8px 0; color: #7a869a; font-weight: 600; text-align: right;">Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${renderHtmlEmailItem(subOrder)}
                    <!-- Totals -->
                    <tr>
                        <td colspan="2" style="padding: 12px 0 4px 0; color: #7a869a; text-align: right;">Subtotal:</td>
                        <td style="padding: 12px 0 4px 0; color: #333333; text-align: right;">${totalPrice}</td>
                    </tr>
                    <tr>
                        <td colspan="2" style="padding: 4px 0; color: #7a869a; text-align: right;">Shipping:</td>
                        <td style="padding: 4px 0; color: #333333; text-align: right;">Free</td>
                    </tr>
                    <tr style="font-weight: bold; font-size: 16px;">
                        <td colspan="2" style="padding: 12px 0; color: #253858; text-align: right; border-top: 1px solid #e1e4e8;">Total paid:</td>
                        <td style="padding: 12px 0; color: #00875a; text-align: right; border-top: 1px solid #e1e4e8;">${totalPrice}</td>
                    </tr>
                </tbody>
            </table>

            <!-- Shipping Info Box -->
            <div class="info-box" style="background-color: #f4f5f7; padding: 20px; border-radius: 6px; margin-bottom: 25px;">
                <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #7a869a; text-transform: uppercase; letter-spacing: 0.5px;">Shipping Address</h4>
                <p style="margin: 0 0 12px 0; font-size: 15px; color: #333333;">
                    ${username}<br>
                    123 Main Street, Apt 4B<br>
                    New York, NY 10001
                </p>
                <div style="border-top: 1px solid #e1e4e8; padding-top: 10px; font-size: 13px; color: #7a869a; line-height: 1.4;">
                    ℹ️ <em>Because this website is a personal project and no actual transactions take place, we will not collect your address.</em>
                </div>
            </div>

            <p style="margin: 0 0 20px 0; font-size: 16px; color: #4a4a4a;">If you have any questions about your order, simply reply to this email. We're always here to help.</p>
            
            <p style="margin: 0; font-size: 16px; color: #4a4a4a;">Warm regards,<br>
            <strong style="font-weight: bold;">The Team</strong></p>
        </div>

        <!-- Footer -->
        <div class="footer" style="background-color: #f4f5f7; padding: 20px; text-align: center; font-size: 12px; color: #7a869a; border-top: 1px solid #e1e4e8;">
            <p style="margin: 0 0 10px 0;">You received this email because you made a purchase from our store.</p>
            <p style="margin: 0;">&copy; 2026 HoangAnWebsite Inc. All rights reserved.</p>
        </div>
    </div>`;

    await sendEmail({
      to: findUser.email,
      subject: "Order Placed!",
      html: emailHtmlForClient,
    });

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

const getAllParentOrder = async (req, res) => {
  try {
    const user = req.userId;

    const result = await Order.find({ user }).populate("subOrders").exec();

    if (!result) {
      return res.status(400).json({ message: "Cannot find your order" });
    }

    res
      .status(200)
      .json({ message: "Get all parents order successful", data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Get orders failed", error: err.message });
  }
};

const getAllSubOrder = (req, res) => {};

module.exports = { createOrder, getAllParentOrder };
