const Admin = require("../model/Admin");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const TestModel = require("../model/Test");
const Order = require("../model/Order");
const Test = require("../model/Test");
const jsonWebToken = require("jsonwebtoken");
const Doctor = require("../model/Doctor");
const { newDocUpload } = require("../utils/upload");

exports.registerAdmin = asyncHandler(async (req, res) => {
  const hashPassword = await bcrypt.hash(req.body.password, 10);
  const result = await Admin.create({ ...req.body, password: hashPassword });
  res.json({
    message: "admin register successfully",
  });
});
exports.getAllAdmin = asyncHandler(async (req, res) => {
  const result = await Admin.find();
  res.json({
    message: "admin fetch successfully",
    result,
  });
});
exports.destroyAdmin = asyncHandler(async (req, res) => {
  const result = await Admin.deleteMany();
  res.json({
    message: "admin destroy successfully",
    result,
  });
});

exports.loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const found = await Admin.findOne({ email });
  if (!found) {
    return res.status(401).json({ message: "email not found" });
  }
  const match = await bcrypt.compare(password, found.password);
  if (!match) {
    return res.status(401).json({ message: "Invalid Password" });
  }
  const token = jwt.sign(
    { adminId: found._id, role: found.role },
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

// test

exports.adminAddTest = asyncHandler(async (req, res) => {
  const isExist = await Test.findOne({ name: req.body.name });
  if (isExist) {
    return res.status(400).json({ message: "Test Already Exist" });
  }
  const result = await TestModel.create(req.body);
  res.json({
    message: "Test Created Successfully",
  });
});
exports.adminGetAllTests = asyncHandler(async (req, res) => {
  const result = await TestModel.find();
  res.json({
    message: "Test Fetch Successfully",
    result,
  });
});

exports.adminUpdateTest = asyncHandler(async (req, res) => {
  const { testId } = req.params;
  console.log(testId);
  // TestModel.d;
  // const result = await TestModel.deleteMany();
  const result = await TestModel.findByIdAndUpdate(testId, req.body, {
    new: true,
  });
  console.log(result);
  res.json({
    message: "Test Updated Successfully",
    result,
  });
});
exports.adminDeleteTest = asyncHandler(async (req, res) => {
  const { testId } = req.params;
  const result = await TestModel.findByIdAndDelete(testId);
  res.json({
    message: "Test Deleted Successfully",
  });
});
exports.adminDestroyTest = asyncHandler(async (req, res) => {
  await TestModel.deleteMany();
  res.json({
    message: "Test Destroyed Successfully",
  });
});

// order
exports.adminAllOrders = asyncHandler(async (req, res) => {
  const result = await Order.find()
    .populate("doctorId")
    .populate("test.testId")
    .populate("pathology");
  res.json({
    message: "Order Fetch Successfully",
    result,
  });
});
exports.adminUpdateOrders = asyncHandler(async (req, res) => {
  if (req.body.action === "assign") {
    const { orderId } = req.params;
    await Order.findByIdAndUpdate(orderId, req.body);
    return res.json({ message: "order updated successfully" });
  }

  newDocUpload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        message: "multer error" + err,
      });
    }

    const newDocs = [];
    if (req.files) {
      for (let i = 0; i < req.files.length; i++) {
        let url =
          process.env.NODE_ENV === "development"
            ? process.env.DEV_URL
            : process.env.PRODUCTION_URL;
        newDocs.push(`${url}/${req.files[i].filename}`);
      }
    }
    const { orderId } = req.params;
    await Order.findByIdAndUpdate(orderId, {
      ...req.body,
      test: JSON.parse(req.body.test),
      docs: [...JSON.parse(req.body.docs), ...newDocs],
    });
    res.json({ message: "order updated successfully" });
  });
  // is login end
});

// delete
exports.adminDeleteOrders = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const result = await Order.findByIdAndDelete(orderId);
  res.json({
    message: "Order Delete Successfully",
  });
});
