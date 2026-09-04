const User = require("../models/User");
const jwt = require("jsonwebtoken");
const {
  deleteRefreshToken,
  REFRESH_TOKEN_SECRET,
  revokeAllUserSessions,
} = require("../utils/tokenService");

const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);

  const refreshToken = cookies.jwt;

  const clearJwtCookie = () => {
    res.clearCookie("jwt", {
      secure: true,
      sameSite: "None",
      httpOnly: true,
    });
  };

  try {
    const decoded = await jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, {
      ignoreExpiration: true,
    });

    const userId = decoded?.userInfo?.id;
    const jti = decoded?.jti;

    const logoutAllDevice = req.query.all === "true" || req.body.all === true;

    if (userId) {
      if (logoutAllDevice) {
        await revokeAllUserSessions(userId);
      } else if (jti) {
        await deleteRefreshToken({ userId, jti });
      }
    }

    clearJwtCookie();

    return res.sendStatus(200);
  } catch (err) {
    clearJwtCookie();
    console.error(err.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { handleLogout };
