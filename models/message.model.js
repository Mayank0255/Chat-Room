const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema(
  {
    room: {
      type: Schema.Types.ObjectId,
      ref: 'Room'
    },
    timestamp: Date,
    text: {
      type: String
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model("Message", MessageSchema);