const User = require("../models/User");

const handleLogout = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);

    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken }).exec();

    const cookieOption = {
      secure: true,
      httpOnly: true,
      sameSite: "None",
    };

    if (!foundUser) {
      res.clearCookie("jwt", cookieOption);
      return res.sendStatus(204);
    }

    foundUser.refreshToken = "";
    await foundUser.save();

    res.clearCookie("jwt", cookieOption);
    return res.sendStatus(204);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Logout failed: ", message: err.message });
  }
};

module.exports = { handleLogout };
