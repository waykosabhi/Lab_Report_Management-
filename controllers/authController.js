const asyncHandler = require("express-async-handler");
const Doctor = require("../model/Doctor");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const Pathology = require("../model/Pathology");
const sendCustonEmails = require("../utils/email");
const { registerTemplate } = require("../utils/templates/register");

exports.continueWithGoogle = asyncHandler(async (req, res) => {
  const { tokenId, account } = req.body;
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  const verify = await client.verifyIdToken({ idToken: tokenId });
  if (!verify) {
    return res.status(400).json({ message: "Account Unverified" });
  }
  const {
    payload: { email, name, picture },
  } = verify;
  let result;
  if (account === "doctor") {
    result = await Doctor.findOne({ email }).lean();
  } else {
    result = await Pathology.findOne({ email }).lean();
  }

  if (result) {
    // sendCustonEmails({
    //   to: email,
    //   sub: "Welcome TO Report Manager Pro+",
    //   msg: "Hello Everyone",
    //   template: registerTemplate(),
    // });
    const token = jwt.sign({ id: result._id }, process.env.JWT_KEY);
    res.cookie("token", token, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true });
    // login
    res.json({
      message: "login success",
      result: { ...result, account },
    });
  } else {
    const data =
      account === "doctor"
        ? await Doctor.create({ name, email, avatar: picture })
        : await Pathology.create({ name, email, avatar: picture });

    const token = jwt.sign({ id: data._id }, process.env.JWT_KEY);
    res.cookie("token", token, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true });

    sendCustonEmails({
      to: email,
      sub: "Welcome TO Report Manager Pro+",
      msg: "Hello Everyone",
      template: registerTemplate(),
    });

    res.json({
      message: "register success",
      // result: { ...data, account },
      result: {
        _id: data._id,
        name: data.name,
        email: data.email,
        avatar: data.avatar,
        active: data.active,
        account,
      },
    });
  }
});

exports.logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("jwt");
  res.json({
    message: "Logut Success",
  });
});
