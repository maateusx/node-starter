module.exports = (app) => {
  const mongoose = require("mongoose")
  let userSchema = mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Insert a name!'],
      trim: true
    },
    username: {
      type: String,
      index: { unique: true },
      required: [true, 'Insert a username!']
    },
    password: {
      type: String,
      select: false,
      required: [true, 'Insert a password!']
    },
    timestamp: {
      type: Date,
      default: new Date().now
    }
  })
  return mongoose.model("User", userSchema)
};
