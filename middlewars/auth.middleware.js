const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      throw Error("Invalid token format");
    }

    const token = authHeader.split(" ")[i];

    if (!token) {
      throw Error("No token provided");
    }

    const { _id } = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findOne({ _id: _id });

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      res.status(401).json({ error: "Invalid token" });
    } else {
      res.status(401).json({ error: "Unauthorized access." });
    }
  }
};

module.exports = authMiddleware;
