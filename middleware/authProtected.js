const jwt = require("jsonwebtoken");
const Doctor = require("../model/Doctor");
const Pathology = require("../model/Pathology");

exports.isDoctor = (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "Please Login First" });
    }
    jwt.verify(token, process.env.JWT_KEY, async (err, decode) => {
      if (err) {
        return res.status(401).json({ message: "Invalid Token" });
      }
      const result = await Doctor.findById(decode.id);
      if (!result) {
        return res.status(401).json({ message: "Doctor only Routesss" });
      }
      req.body.doctorId = result._id;
      next();
    });
  } catch (error) {
    return res.status(401).json({ message: "Unable to Authenticate  " });
  }
};

exports.isPathology = (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "Please Login First" });
    }
    jwt.verify(token, process.env.JWT_KEY, async (err, decode) => {
      if (err) {
        return res.status(401).json({ message: "Invalid Token" });
      }
      const result = await Pathology.findById(decode.id);
      if (!result) {
        return res.status(401).json({ message: "Pathology only Route" });
      }
      req.body.pathologyId = result._id;
      next();
    });
  } catch (error) {
    return res.status(401).json({ message: "Unable to Authenticate  " });
  }
};
