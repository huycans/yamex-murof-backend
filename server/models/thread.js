const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const threadSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  tag: {
    type: String,
  },
  subForumId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subforum",
  },
  latestReply: {
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
// add a virtual id field 
threadSchema.set('toJSON', {
  virtuals: true
});

let Threads = mongoose.model("Thread", threadSchema);

module.exports = Threads;