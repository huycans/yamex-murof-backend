const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bikeSchema = new Schema({
  brand: {
    type: String
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
  },
  power: {
    type: String,
  },
  tags: {
    type: String,
  },
  isStillProducing: {
    type: Boolean
  }
}, {
  timestamps: {
    createdAt: "createdTime",
    updatedAt: "lastModifiedTime"
  }
})

let Bikes = mongoose.model("Bike", bikeSchema);

module.exports = Bikes;