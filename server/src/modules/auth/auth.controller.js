const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);
const User = require("../users/user.model");
const {
  registerUser,
  loginUser,
} = require("./auth.service");

const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);

    res.status(201).json({
      success: true,
      message: "User registered",
      user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const data = await loginUser(
      email,
      password
    );

    res.cookie("token", data.token, {
      httpOnly: true,
      secure: false, // true in production with HTTPS
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      user: data.user,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(
      req.user.userId
    ).select("-password");

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const logout = async (
  req,
  res
) => {

  res.clearCookie("token");

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });

};

const googleLogin = async (req, res) => {
  try {

    const { credential } = req.body;

    const ticket =
      await client.verifyIdToken({
        idToken: credential,
        audience:
          process.env.GOOGLE_CLIENT_ID,
      });

    const payload =
      ticket.getPayload();

    const {
      email,
      name,
    } = payload;

    let user =
      await User.findOne({
        email,
      });

    if (!user) {

      user =
        await User.create({
          name,
          email,
          authProvider:
            "GOOGLE",
        });

    }

    const token =
      jwt.sign(
        {
          userId: user._id,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge:
        7 *
        24 *
        60 *
        60 *
        1000,
    });

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {

    console.log(error);

    res.status(400).json({
      success: false,
      message:
        "Google Login Failed",
    });

  }
};

module.exports = {
  register,
  login,
  getProfile,
  logout,
  googleLogin,
};
