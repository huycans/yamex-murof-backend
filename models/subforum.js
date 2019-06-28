const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subforumSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  path: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  forumId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Forum",
  },
  latestThread: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Thread",
  }
}, {
  timestamps: {
    createdAt: "createdTime",
    updatedAt: "lastModifiedTime"
  }
});

// add a virtual id field 
subforumSchema.set('toJSON', {
  virtuals: true
});

let Subforums = mongoose.model("Subforum", subforumSchema);

module.exports = Subforums;