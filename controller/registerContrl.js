const Otp = require("../models/Otp");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const handleRegister = async (req, res) => {
  try {
    const { username, password, email, otp } = req.body;

    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord) {
      return res.status(400).json({
        message: "OTP has expired or was never requested. Please try again",
      });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    const existedUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }],
    }).exec();

    if (existedUser) {
      if (existedUser.email) {
        return res
          .status(409)
          .json({ message: "This email is already registered" });
      }
      if (existedUser.username) {
        return res
          .status(409)
          .json({ message: "This name is already registered" });
      }
    }

    // hash the password
    const hashedPwd = await bcrypt.hash(password, saltRounds);

    const result = await User.create({
      username,
      email,
      password: hashedPwd,
    });
    await Otp.deleteOne({ _id: otpRecord._id });
    res.status(201).json({ username: result.username, email: result.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error registering user" });
  }
};

module.exports = { handleRegister };
