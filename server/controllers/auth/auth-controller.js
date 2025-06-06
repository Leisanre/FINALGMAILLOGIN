const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const { OAuth2Client } = require("google-auth-library");
const { cleanupUserData } = require("../../helpers/database-utils");

const GOOGLE_CLIENT_ID = "231430169210-fgm3ltoieaknm6l0klnt9oi2bh9aovcd.apps.googleusercontent.com";
const JWT_SECRET = "BOOKSYNC";

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

const googleLogin = async (req, res) => {
  const { googleToken } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload.email_verified) {
      return res.status(400).json({ success: false, message: "Email not verified by Google" });
    }

    // Clean up any orphaned data first
    let user = await cleanupUserData(payload.email);
    let isNewUser = false;

    if (!user) {
      // Check if userName already exists and create a unique one if needed
      let uniqueUserName = payload.name;
      let userNameExists = await User.findOne({ userName: uniqueUserName });
      let counter = 1;
      
      while (userNameExists) {
        uniqueUserName = `${payload.name}_${counter}`;
        userNameExists = await User.findOne({ userName: uniqueUserName });
        counter++;
      }

      // Create new user when signing in with Google for the first time
      try {
        user = new User({
          userName: uniqueUserName,
          email: payload.email,
          password: null,
          authType: "google",
          avatar: payload.picture,
        });

        await user.save();
        isNewUser = true;
      } catch (duplicateError) {
        // Handle potential duplicate key errors
        if (duplicateError.code === 11000) {
          // If it's a duplicate email error, try to find the existing user again
          if (duplicateError.keyPattern?.email) {
            user = await User.findOne({ email: payload.email });
            if (user) {
              isNewUser = false;
            } else {
              return res.status(400).json({
                success: false,
                message: "Account creation failed. Please try again."
              });
            }
          } else {
            return res.status(400).json({
              success: false,
              message: "Username already exists. Please try again."
            });
          }
        } else {
          throw duplicateError;
        }
      }
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
        userName: user.userName,
      },
      JWT_SECRET,
      { expiresIn: "60m" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    }).json({
      success: true,
      message: isNewUser ? "Account created and logged in successfully with Google" : "Logged in with Google",
      user: {
        email: user.email,
        role: user.role,
        id: user._id,
        userName: user.userName,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({ success: false, message: "Google token invalid or expired" });
  }
};

const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.json({ success: false, message: "User already exists with this email" });
    }

    const hashPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      userName,
      email,
      password: hashPassword,
    });

    await newUser.save();

    res.status(200).json({ success: true, message: "Registration successful" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Some error occurred" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return res.json({ success: false, message: "User doesn't exist! Please register first." });
    }

    if (!checkUser.password) {
      return res.json({ success: false, message: "This account was created using Google. Please log in with Google." });
    }

    const checkPasswordMatch = await bcrypt.compare(password, checkUser.password);
    if (!checkPasswordMatch) {
      return res.json({ success: false, message: "Incorrect password! Please try again." });
    }

    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName,
      },
      JWT_SECRET,
      { expiresIn: "60m" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    }).json({
      success: true,
      message: "Logged in successfully",
      user: {
        email: checkUser.email,
        role: checkUser.role,
        id: checkUser._id,
        userName: checkUser.userName,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Some error occurred" });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("token").json({ success: true, message: "Logged out successfully!" });
};

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized user!" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Unauthorized user!" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
  googleLogin,
};
