const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const replySchema = new Schema({
  content:{
    type: String
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  threadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Thread",
  }
}, {
  timestamps: {
    createdAt: "createdTime",
    updatedAt: "lastModifiedTime"
  }
});


let Replies = mongoose.model("Reply", replySchema);

module.exports = Replies;