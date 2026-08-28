const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  generateToken,
  storeRefreshToken,
  REFRESH_TOKEN_EXPIRY,
  MAX_ALLOWED_ATTEMPTS,
  getFailedLoginCount,
  resetFailedLogins,
  handleFailedAttempt,
} = require("../utils/tokenService");

const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const ip = req.ip;

    const failedCount = await getFailedLoginCount({ ip, email });

    if (failedCount >= MAX_ALLOWED_ATTEMPTS) {
      return res.status(429).json({
        message:
          "Too many failed attempts. Account temporarily locked for 15 minutes.",
      });
    }

    const foundUser = await User.findOne({ email }).exec();

    if (!foundUser) {
      await bcrypt.compare(password, "$2b$10$abcdefghijklmnopqrstuuuDUMMYHASH");
      await handleFailedAttempt({ ip, email, sendWarning: false });
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, foundUser.password);

    if (match) {
      const roles = Object.values(foundUser.roles);

      const newTokens = generateToken({
        userInfo: {
          username: foundUser.username,
          id: foundUser._id,
          roles,
        },
      });

      const decodeRefresh = jwt.decode(newTokens.refreshToken);
      await storeRefreshToken({
        userId: foundUser._id,
        jti: decodeRefresh.jti,
        ttlSeconds: REFRESH_TOKEN_EXPIRY,
      });

      await resetFailedLogins({ ip, email });

      res.cookie("jwt", newTokens.refreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: REFRESH_TOKEN_EXPIRY * 1000,
      });

      res.json({ accessToken: newTokens.accessToken });
    } else {
      await handleFailedAttempt({ ip, email, sendWarning: true });

      return res.status(401).json({
        message: "invalid email or password",
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { handleLogin };
