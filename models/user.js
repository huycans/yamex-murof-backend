const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var passportLocalMongoose = require("passport-local-mongoose");

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
  lastLogin: {
    type: Date
  }
}, {
    timestamps: {
      createdAt: "createdTime",
      updatedAt: "lastModifiedTime"
    }
  });

//   //setting the default value of lastLogin to createdAt
// userSchema.pre("save", function (next) {
//   this.lastLogin = this.createdAt;
//   next();
// })

// add a virtual id field 
userSchema.set('toJSON', {
  virtuals: true
});
userSchema.plugin(passportLocalMongoose);
userSchema.statics.login = function login(id, callback) {
  return this.findByIdAndUpdate(id, { $set: { 'lastLogin': Date.now() } }, { new: true }, callback);
};

let Users = mongoose.model("User", userSchema);

module.exports = Users;

