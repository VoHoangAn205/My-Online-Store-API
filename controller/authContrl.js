const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  const { username, password } = req.body;

  if (!username && !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  const foundUser = await User.findOne({ username }).exec();

  if (!foundUser) {
    return res
      .status(401)
      .json({ message: "username or password is incorrect" });
  }

  const match = await bcrypt.compare(password, foundUser.password);

  if (match) {
    const roles = Object.values(foundUser.roles);

    const accessToken = jwt.sign(
      {
        userInfo: {
          username: foundUser.username,
          id: foundUser._id,
          roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10m" },
    );

    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: 24 * 60 * 60 * 1000 },
    );

    const result = await User.findByIdAndUpdate(
      foundUser._id,
      { refreshToken },
      { returnDocument: "after" },
    ).exec();

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = { handleLogin };
