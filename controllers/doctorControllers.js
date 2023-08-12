const asyncHandler = require("express-async-handler");
const Doctor = require("../model/Doctor");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const TestModel = require("../model/Test");

exports.registerDoctor = asyncHandler(async (req, res) => {
  const hashPassword = await bcrypt.hash(req.body.password, 10);
  const result = await Doctor.create({ ...req.body, password: hashPassword });
  res.json({
    message: "Doctor register successfully",
  });
});
exports.getAllDoctor = asyncHandler(async (req, res) => {
  const result = await Doctor.find().select(
    " -password -__v -createdAt -updatedAt"
  );
  res.json({
    message: "Doctor fetch successfully",
    result,
  });
});
exports.destroyDoctor = asyncHandler(async (req, res) => {
  const result = await Doctor.deleteMany();
  res.json({
    message: "Doctor Destroy successfully",
    result,
  });
});
exports.updateDoctor = asyncHandler(async (req, res) => {
  const { doctorId } = req.params;
  const result = await Doctor.findByIdAndUpdate(doctorId, req.body, {
    new: true,
  });
  res.json({
    message: "Doctor update successfully",
    result,
  });
});
exports.deleteDoctor = asyncHandler(async (req, res) => {
  const { doctorId } = req.params;
  const result = await Doctor.findByIdAndDelete(doctorId);
  res.json({
    message: "Doctor Delete successfully",
    result,
  });
});
exports.getAllDoctorTests = asyncHandler(async (req, res) => {
  const result = await TestModel.find().select("  -__v -createdAt -updatedAt");
  res.json({
    message: "Doctor Test fetch successfully",
    result,
  });
});

exports.loginDoctor = asyncHandler(async (req, res) => {
  const { mobile, password } = req.body;
  const found = await Doctor.findOne({ mobile });
  if (!found) {
    return res.status(401).json({ message: "mobile not found" });
  }
  const match = await bcrypt.compare(password, found.password);
  if (!match) {
    return res.status(401).json({ message: "Invalid Password" });
  }
  const token = jwt.sign(
    { doctorId: found._id, role: found.role },
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
