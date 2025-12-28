const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // 1. Lấy header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "No token provided"
      });
    }

    // 2. Kiểm tra Bearer token
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "Invalid token format"
      });
    }

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Gắn user vào request
    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    console.log("USER:", req.user);

    // 5. Cho đi tiếp
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
      error: error.message
    });
  }
};

module.exports = authMiddleware;
