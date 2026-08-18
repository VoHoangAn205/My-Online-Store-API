const { sendEmail } = require("../helper/sendEmail");
const User = require("../models/User");
const vendorRequestEmail = require("../helper/vendorRequestEmail");

const getUserInfo = async (req, res) => {
  try {
    const user = req.userId;

    const result = await User.findById(user)
      .select("username email roles")
      .exec();

    if (!result) {
      return res
        .status(404)
        .json({ message: "user information are not exist" });
    }

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Cannot get user information: ", error: err.message });
  }
};

const upgradeToVendor = async (req, res) => {
  try {
    const user = req.userId;

    const foundUser = await User.findById(user).select(
      "username email roles isPendingVendor",
    );

    if (!foundUser) {
      return res
        .status(404)
        .json({ message: "user information are not exist" });
    }

    if (foundUser.roles?.includes(1984)) {
      return res.status(400).json({ message: "You are already a vendor." });
    }

    if (foundUser.isPendingVendor) {
      return res
        .status(400)
        .json({ message: "You already have a pending upgrade request." });
    }

    foundUser.isPendingVendor = true;
    await foundUser.save();

    const emailForm = vendorRequestEmail(foundUser);

    await sendEmail({
      from: `"System Notifications" <${process.env.EMAIL_USER}>`,
      replyTo: foundUser.email, // Allows you to click "Reply" to respond directly to the user
      to: process.env.EMAIL_USER,
      subject: `New Vendor Upgrade Request: ${foundUser.username}`,
      html: emailForm,
    });

    res.status(200).json({ message: "Email send successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Cannot get user information: ", error: err.message });
  }
};

module.exports = { getUserInfo, upgradeToVendor };
