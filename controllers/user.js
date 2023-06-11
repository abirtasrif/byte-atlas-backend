const jwt = require("jsonwebtoken");
const User = require("../models/user");
const mongoose = require("mongoose");

//jwt token generate
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

//signup user
const signupUser = async (req, res) => {
  const { name, username, email, password } = req.body;
  const ipAddress =
    req.headers["x-forward-for"] || req.connection.remoteAddress;

  try {
    const user = await User.signup(name, username, email, password, ipAddress);

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
    req.headers["x-forward-for"] || req.connection.remoteAddress;

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

//get an user
const getUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw Error("User not found");
    }

    if (userId !== req.user?._id.toString()) {
      throw Error("Unauthorized access");
    }

    const user = await User.findById(userId);

    if (!user) {
      throw Error("User not found");
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// delete an user
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw Error("User not found");
    }

    if (userId !== req.user?._id.toString()) {
      throw Error("Unauthorized access");
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      throw Error("User not found");
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// update an user
const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw Error("User not found");
    }

    if (userId !== req.user?._id.toString()) {
      throw Error("Unauthorized access");
    }

    if (!name) {
      throw Error("Name field must be filled");
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { name } },
      { new: true }
    );

    if (!user) {
      throw Error("User not found");
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports = {
  signupUser,
  loginUser,
  getUser,
  deleteUser,
  updateUser,
};
