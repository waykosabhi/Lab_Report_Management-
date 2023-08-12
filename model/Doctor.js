const { default: mongoose } = require("mongoose");

const doctorSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    hospitalName: {
      type: String,
    },
    mobile: {
      type: Number,
    },
    gender: {
      type: String,
    },
    password: {
      type: String,
      // required: true,
    },
    address: {
      type: String,
    },
    email: {
      type: String,
    },
    dop: {
      type: String,
    },
    doa: {
      type: String,
    },
    avatar: {
      type: String,
    },
    education: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("doctor", doctorSchema);
