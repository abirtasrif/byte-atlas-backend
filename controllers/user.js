const jwt = require("jsonwebtoken");
const User = require("../models/user");

//jwt token generate
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

//signup user
const signupUser = async (req, res) => {
  const { name, username, email, password } = req.body;
  const ipAddress =
    req.headers["x-forward-for"] || req.conncetion.remoteAddress;

  try {
    const user = await User.signUp(name, username, email, password, ipAddress);

    //create token
    const token = createToken(user._id);

    //save token as cookie
    res.cookie("token", token, {
      maxAge: 86400 * 1000,
      httpOnly: true,
      secure: true,
    });

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const ipAddress =
    req.headers["x-forward-for"] || req.conncetion.remoteAddress;

  try {
    const user = await User.login(email, password, ipAddress);

    //create token
    const token = createToken(user._id);

    //clear previous cookie
    res.clearCookie("token");

    //save token as cookie
    res.cookie("token", token, {
      maxAge: 86400 * 1000,
      httpOnly: true,
      secure: true,
    });

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  signupUser,
  loginUser,
};
