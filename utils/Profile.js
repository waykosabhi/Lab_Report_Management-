// 1.filename, 2.Destination

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  filename: (req, file, next) => {
    const ext = path.extname(file.originalname);
    //Date.now=> 1 jan. 1970 pasun che milisecond count karte
    const fn = Date.now() + ext;
    next(null, fn);
  },
  destination: (req, file, next) => {
    next(null, "profile");
  },
});

exports.profileUpload = multer({ storage }).single("profile");
