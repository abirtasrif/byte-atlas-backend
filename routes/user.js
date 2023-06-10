const express = require("express");
const {
  signupUser,
  loginUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
} = require("../controllers/user");
const authMiddleware = require("../middlewars/auth.middleware");

//router
const router = express.Router();

//login router
router.post("/login", loginUser);

//signup router
router.post("/signup", signupUser);

// get all users
router.get("/all", authMiddleware, getUsers);

// get an user
router.get("/:userId", authMiddleware, getUser);

// update an user
router.patch("/:userId", authMiddleware, updateUser);

//delete an user
router.delete("/:userId", authMiddleware, deleteUser);

module.exports = router;
