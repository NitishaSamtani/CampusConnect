const bcrypt = require("bcryptjs");
const User = require("../users/user.model");
const generateToken = require("../../config/jwt");

const registerUser = async (data) => {
  const {
    name,
    email,
    password,
    college,
    branch,
  } = data;

  const existingUser = await User.findOne({
    email,
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword =
    await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    college,
    branch,
  });

  return user;
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken(
    user._id,
    user.role
  );

  return {
    token,
    user,
  };
};

module.exports = {
  registerUser,
  loginUser,
};