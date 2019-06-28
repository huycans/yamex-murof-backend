const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
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
    type: String
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
// add a virtual id field 
userSchema.set('toJSON', {
  virtuals: true
});
let Users = mongoose.model("User", userSchema);

module.exports = Users;

