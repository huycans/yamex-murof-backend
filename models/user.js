const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const threadSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String
  },
  avatarUrl: {
    type: String
  },
  role: {
    type: String
  },
  lastLogin: {
    type: Date
  },
  favoriteBike: {
    type: Date
  },
  isActive: {
    type: Boolean
  },
}, {
  timestamps: {
    createdAt: "createdTime",
    updatedAt: "lastModifiedTime"
  }
});

let Threads = mongoose.model("Thread", threadSchema);

module.exports = Threads;

