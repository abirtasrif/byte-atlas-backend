const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

//user model
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  ipAddress: {
    type: String,
    required: true,
  },
});

//static signup method
userSchema.statics.signup = async function (
  name,
  username,
  email,
  password,
  ipAddress
) {
  // validation
  if (!name || !username || !email || !password || !ipAddress) {
    throw Error("All fields must be filled");
  }

  if (!validator.isEmail(email)) {
    throw Error("Invalid email !");
  }

  if (!validator.isStrongPassword(password)) {
    throw Error(
      "Password must be 8+ characters, uppercase, lowercase, number & symbol"
    );
  }

  const existedEmail = await this.findOne({ email });

  if (existedEmail) {
    throw Error("Email address is already used");
  }

  //hashing
  const salt = await bcrypt.genSalt(10);
  const hashPass = await bcrypt.hash(password, salt);

  //user creation
  const user = await this.create({
    name,
    username,
    email,
    password: hashPass,
    ipAddress,
  });

  return user;
};

//static login method
userSchema.statics.login = async function (email, password, ipAddress) {
  // validation
  if (!email || !password || !ipAddress) {
    throw Error("All fields must be filled");
  }

  const user = await this.findOne({ email, ipAddress });
  if (!user) {
    throw Error("Incorrect email or restricted ip address");
  }

  //password comparison
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error("incorrect Password");
  }

  return user;
};

module.exports = mongoose.model("User", userSchema);
