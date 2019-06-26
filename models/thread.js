const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const threadSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
  },
  subForumId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subforum",
  },
  latestreply: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reply",
  },
  firstReply: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reply",
  }
}, {
  timestamps: {
    createdAt: "createdTime",
    updatedAt: "lastModifiedTime"
  }
});


let Threads = mongoose.model("Thread", threadSchema);

module.exports = Threads;