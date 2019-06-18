const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const forumSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  path: {
    type: String,
    required: true,
  },
  coverUrl: {
    type: String,
  },
  bikeInfo: {
    type: String,
  },
  moderators: {
    type: String
  }
}, {
  timestamps: {
    createdAt: "createdTime",
    updatedAt: "lastModifiedTime"
  }
});


let Forums = mongoose.model("Bike", forumSchema);

module.exports = Forums;