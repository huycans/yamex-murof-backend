var multer = require('multer');

//setup multer middleware for file (mostly avatar) processing
//store images in temp-img folder, file name is req.user.id + "-" + Date.now()
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
  cb(null, 'server/temp-img')
},
filename: function (req, file, cb) {
  let date = new Date();
  let nonce = date.getTime();
  //set this nonce for the middleware in PUT user/:userID
  req.imgNonce = nonce.toString();

  cb(null, nonce + "_" + file.originalname);
}
})

var upload = multer({ storage: storage })

module.exports = upload;