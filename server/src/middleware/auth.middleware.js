const jwt = require("jsonwebtoken");
const User = require("../modules/users/user.model");

const authMiddleware = async (req, res, next) => {
  try {
    /*
    ========================================
    GET TOKEN FROM COOKIE
    ========================================
    */

    let token = req.cookies?.token;

    /*
    ========================================
    GET TOKEN FROM AUTHORIZATION HEADER
    ========================================
    */

    if (!token) {
      const authHeader = req.headers.authorization;

      if (
        authHeader &&
        authHeader.startsWith("Bearer ")
      ) {
        token = authHeader.split(" ")[1];
      }
    }

    /*
    ========================================
    TOKEN NOT FOUND
    ========================================
    */

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    /*
    ========================================
    VERIFY JWT
    ========================================
    */

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    /*
    ========================================
    FIND USER
    ========================================
    */

    const user = await User.findById(
      decoded.userId
    ).select(
      "_id name email role isBlocked"
    );

    /*
    ========================================
    USER NOT FOUND
    ========================================
    */

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    /*
    ========================================
    BLOCKED USER
    ========================================
    */

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked.",
      });
    }

    /*
    ========================================
    ATTACH USER TO REQUEST
    ========================================
    */

    req.user = {
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    /*
    ========================================
    CONTINUE
    ========================================
    */

    next();

  } catch (error) {
    console.error(
      "Authentication Error:",
      error.message
    );

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

module.exports = authMiddleware;