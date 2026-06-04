const Otp = require("../models/Otp");
const User = require("../models/User");
const generateOtp = require("../utils/generateOtpNumber");

const handleRequestOtp = async (req, res) => {
  try {
    const email = req.body.email;

    if (!email) {
      return res.status(400).json({ message: "Your email is required" });
    }

    const duplicate = await User.findOne({ email }).exec();

    if (duplicate) {
      return res
        .status(409)
        .json({ message: "This email is already registered" });
    }

    const otpCode = generateOtp();

    const result = await Otp.findOneAndUpdate(
      { email },
      { otp: otpCode, createAt: Date.now },
      { upsert: true, returnDocument: "after" },
    );

    const emailHtml = `<div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
        <h2>Verify Your Email</h2>
        <p>Thank you for signing up. Use the verification code below to complete your registration:</p>
        <h1 style="background: #f4f4f4; padding: 10px; display: inline-block; letter-spacing: 5px; color: #333;">${otpCode}</h1>
        <p style="color: #777; font-size: 12px;">This code is strictly valid for 5 minutes.</p>
      </div>`;

    await sendEmail({
      to: email,
      subject: "Your Registration Verification Code",
      html: emailHtml,
    });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ message: "Request otp failed: ", error: err.message });
  }
};
