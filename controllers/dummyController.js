const asyncHandler = require("express-async-handler");
const { profileUpload } = require("../utils/Profile");

exports.addProfile = asyncHandler(async (req, res) => {
  profileUpload(req, res, async (err) => {
    if (err) {
      return res.json({ message: "multer Error" + err });
    }
    // database queary
    console.log(req.file);
    res.json({ message: "Profile Created Successfully" });
  });
});
