var cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: "cloudtree",
  api_key: "539421265266171",
  api_secret: "jKIY82vkjDa62AjfT8K6ObP7iAo"
})
module.exports = cloudinary;
