const mongoose = require("mongoose");
// const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: String,
    password: String,
    socketId: Number,
    room: {
      type: Schema.Types.ObjectId,
      ref: 'Room'
    }
  },
  {
    timestamps: true
  }
);

// UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);