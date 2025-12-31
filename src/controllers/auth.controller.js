const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { successResponse, errorResponse } = require("../utils/response");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, "Email already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user"
    });

    const savedUser = await user.save();

    return successResponse(res, {
      id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      role: savedUser.role
    }, 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, "Invalid email or password", 400);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return errorResponse(res, "Invalid email or password", 400);
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return successResponse(res, {
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
