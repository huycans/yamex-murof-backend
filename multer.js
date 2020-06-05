var multer = require('multer');

//setup multer middleware for file (mostly avatar) processing
//store images in temp-img folder, file name is req.user.id + "-" + Date.now()
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
  cb(null, 'temp-img')
},
filename: function (req, file, cb) {
  cb(null, file.originalname)
}
})

var upload = multer({ storage: storage })

module.exports = upload;