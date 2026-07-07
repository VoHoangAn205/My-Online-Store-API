const User = require("../models/User");

const getUserInfo = async (req, res) => {
  try {
    const user = req.userId;

    const result = await User.findById(user).select("username email roles");

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

module.exports = { getUserInfo };
