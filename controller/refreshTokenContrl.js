const User = require("../models/User");
const jwt = require("jsonwebtoken");
const {
  REFRESH_TOKEN_SECRET,
  getRefreshToken,
  revokeAllUserSessions,
  deleteRefreshToken,
  generateToken,
  storeRefreshToken,
  REFRESH_TOKEN_EXPIRY,
} = require("../utils/tokenService");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt)
    return res
      .status(401)
      .json({ message: "you are not authenticated or your token is expired" });

  const refreshToken = cookies.jwt;

  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  try {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    const userId = decoded.userInfo.id;
    const jti = decoded.jti;

    const tokenStatus = await getRefreshToken({ userId, jti });

    if (!tokenStatus || tokenStatus !== "active") {
      console.warn(`[SECURITY ALERT] Token reuse detected for User: ${userId}`);

      await revokeAllUserSessions(userId);

      return res.status(403).json({
        message:
          "Security breach detected. All active sessions revoked. Please log in again",
      });
    }

    await deleteRefreshToken({ userId, jti });

    const foundUser = await User.findById(userId).exec();
    if (!foundUser) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    const roles = Object.values(foundUser.roles);

    const newTokens = generateToken({
      userInfo: {
        username: foundUser.username,
        id: foundUser._id,
        roles,
      },
    });

    const newDecoded = jwt.decode(newTokens.refreshToken);

    await storeRefreshToken({
      userId: foundUser._id,
      jti: newDecoded.jti,
      ttlSecond: REFRESH_TOKEN_EXPIRY,
    });

    res.cookie("jwt", newTokens.refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: REFRESH_TOKEN_EXPIRY * 1000,
    });

    res.status(200).json({ accessToken: newTokens.accessToken });
  } catch (err) {
    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { handleRefreshToken };
