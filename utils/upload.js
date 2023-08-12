const multer = require("multer");
const path = require("path");
const docstorage = multer.diskStorage({
  filename: (req, file, next) => {
    const ext = path.extname(file.originalname);
    const fn = Date.now() + ext;
    next(null, fn);
  },
  destination: (req, res, next) => {
    next(null, "uploads");
  },
});
const reportStorage = multer.diskStorage({
  filename: (req, file, next) => {
    const ext = path.extname(file.originalname);
    const fn = Date.now() + ext;
    next(null, fn);
  },
  destination: (req, res, next) => {
    next(null, "reports");
  },
});
exports.docUpload = multer({ storage: docstorage }).array("docs", 5);
exports.newDocUpload = multer({ storage: docstorage }).array("newDocs", 5);
exports.reportUpload = multer({ storage: reportStorage }).array("reports", 5);
