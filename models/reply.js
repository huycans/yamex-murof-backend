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
  },
  thankedList: [{type: String}],
  numberOfThank: {
    type: Number
  }
}, {
  timestamps: {
    createdAt: "createdTime",
    updatedAt: "lastModifiedTime"
  }
});

// add a virtual id field 
replySchema.set('toJSON', {
  virtuals: true
});

let Replies = mongoose.model("Reply", replySchema);

module.exports = Replies;