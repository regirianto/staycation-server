const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "public/images",
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const uploadSingle = multer({
  storage: storage,
  limits: { fileSize: 5000000 },
}).single("image");

const uploadMultiple = multer({
  storage: storage,
  limits: { fileSize: 7000000 },
}).array("image");

// function checkFileType(file, cb) {
//   const fileTypes = /jpeg|jpg|png|gif/;
//   const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
//   const mimeType = fileTypes.test(file.mimetype);
//   if (mimeType && extName) {
//     return cb(null, true);
//   } else {
//     cb(null, false);
//   }
// }
module.exports = { uploadSingle, uploadMultiple };
