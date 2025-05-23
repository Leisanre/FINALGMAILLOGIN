const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    default: null, // allow null for Google-auth users
  },
  authType: {
    type: String,
    enum: ["local", "google"],
    default: "local",
  },
  avatar: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
