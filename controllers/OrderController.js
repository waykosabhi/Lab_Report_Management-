const asyncHandler = require("express-async-handler");
const Order = require("../model/Order");
const { docUpload } = require("../utils/upload");
const jsonWebToken = require("jsonwebtoken");
const Doctor = require("../model/Doctor");

exports.addTestController = asyncHandler(async (req, res) => {
  docUpload(req, res, async (err) => {
    if (err) {
      res.status(400).json({ message: "multer error" + err });
    }
    // is login start
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "please Login" });
    }
    jsonWebToken.verify(token, process.env.JWT_KEY, async (err, decode) => {
      if (err) {
        return res.status(401).json({ message: "Invalid Token" });
      }
      const result = await Doctor.findById(decode.id);
      if (!result) {
        return res
          .status(401)
          .json({ message: "Doctor only routes. You are not doctor" });
      }
      req.body.doctorId = result._id;
      console.log(req.body);
      console.log(req.body);
      const docs = [];
      for (let i = 0; i < req.files.length; i++) {
        let url =
          process.env.NODE_ENV === "development"
            ? process.env.DEV_URL
            : process.env.PRODUCTION_URL;
        docs.push(`${url}/${req.files[i].filename}`);
      }
      await Order.create({
        ...req.body,
        test: JSON.parse(req.body.test),
        docs,
      });
      res.json({ message: "order placed successfully" });
    });
    // is login end
  });
});
exports.getAllOrders = asyncHandler(async (req, res) => {
  const result = await Order.find({ doctorId: req.body.doctorId })
    .populate("doctorId", "name")
    .populate("test.testId");

  res.json({ message: "order Fetch successfully", result });
});
exports.destroyOrderController = asyncHandler(async (req, res) => {
  const result = await Order.deleteMany();
  res.json({ message: "order Destroy successfully" });
});
