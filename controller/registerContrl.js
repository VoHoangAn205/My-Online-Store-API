const User = require("../models/User");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const registerContrl = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  const duplicate = await User.findOne({ username }).exec();

  if (duplicate) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // hash the password
  const hashedPwd = await bcrypt.hash(password, saltRounds);

  try {
    const result = await User.create({
      username,
      password: hashedPwd,
    });
    res.status(201).json({ message: `New user ${username} created` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error registering user" });
  }
};

module.exports = registerContrl;
