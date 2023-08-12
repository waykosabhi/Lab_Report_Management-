const asyncHandler = require("express-async-handler");
const Pathology = require("../model/Pathology");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jsonWebToken = require("jsonwebtoken");

const Order = require("../model/Order");
const { reportUpload } = require("../utils/upload");

exports.registerPathology = asyncHandler(async (req, res) => {
  const hashPassword = await bcrypt.hash(req.body.password, 10);
  const result = await Pathology.create({
    ...req.body,
    password: hashPassword,
  });
  res.json({
    message: "Pathology register successfully",
  });
});

exports.pathologyGetAll = asyncHandler(async (req, res) => {
  const result = await Pathology.find();
  res.json({
    message: "Pathology fetch successfully",
    result,
  });
});

exports.addPathology = asyncHandler(async (req, res) => {
  const isExist = await Pathology.findOne({ name: req.body.name });
  if (isExist) {
    return res.status(400).json({ message: "Pathology Already Added" });
  }
  const result = await Pathology.create(req.body);
  res.json({
    message: "Pathology Added Successfully",
  });
});

exports.destroyPathology = asyncHandler(async (req, res) => {
  const result = await Pathology.deleteMany();
  res.json({
    message: "Pathology Destroy successfully",
    result,
  });
});
exports.updatePathology = asyncHandler(async (req, res) => {
  const { pathologyId } = req.params;
  const result = await Pathology.findByIdAndUpdate(pathologyId, req.body, {
    new: true,
  });
  res.json({
    message: "Pathology update successfully",
    result,
  });
});
exports.deletePathology = asyncHandler(async (req, res) => {
  const { pathologyId } = req.params;
  const result = await Pathology.findByIdAndDelete(pathologyId);
  res.json({
    message: "Pathology Delete successfully",
    result,
  });
});

exports.loginPathology = asyncHandler(async (req, res) => {
  const { mobile, password } = req.body;
  const found = await Pathology.findOne({ mobile });
  if (!found) {
    return res.status(401).json({ message: "mobile not found" });
  }
  const match = await bcrypt.compare(password, found.password);
  if (!match) {
    return res.status(401).json({ message: "Invalid Password" });
  }
  const token = jwt.sign(
    { pathologyId: found._id, role: found.role },
    process.env.JWT_KEY
  );

  res.cookie("jwt", token, {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
    //  secure: true
  });
  res.json({
    message: "login successfully",
    result: found,
  });
});

exports.pathologyOrders = asyncHandler(async (req, res) => {
  const result = await Order.find({ pathology: req.body.pathologyId })
    .populate("doctorId")
    .populate("test.testId");
  res.json({
    message: "Pathology order fetched successfully",
    result,
  });
});

exports.pathologyAcceptOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const result = await Order.findByIdAndUpdate(
    orderId,
    { status: "accept" },
    { new: true }
  );
  res.json({ message: "Pathology order Accepted" });
});
exports.pathologyUploadReports = asyncHandler(async (req, res) => {
  reportUpload(req, res, async (err) => {
    if (err) {
      res.status(400).json({ message: "multer error" + err });
    }
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "please Login" });
    }
    jsonWebToken.verify(token, process.env.JWT_KEY, async (err, decode) => {
      if (err) {
        return res.status(401).json({ message: "Invalid Token" });
      }
      const result = await Pathology.findById(decode.id);
      if (!result) {
        return res
          .status(401)
          .json({ message: "Pathology only routes. You are not Pathology" });
      }
      req.body.pathologyId = result._id;
      console.log(req.body);

      const reports = [];
      for (let i = 0; i < req.files.length; i++) {
        let url =
          process.env.NODE_ENV === "development"
            ? process.env.DEV_URL
            : process.env.PRODUCTION_URL;
        reports.push(`${url}/${req.files[i].filename}`);
      }
      const { orderId } = req.params;
      await Order.findByIdAndUpdate(orderId, { reports });
      res.json({ message: "Report Upload Successfully" });
    });
  });
});
