const mongoose = require("mongoose");

const testSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mrp: {
      type: Number,
      required: true,
    },
    dprice: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "gynacologist",
        "general Physician",
        "gastroenterologist",
        "physician",
      ],
    },
    validity: {
      type: Date,
    },
    gender: {
      type: String,
    },
    height: {
      type: String,
    },
    weight: {
      type: String,
    },
    dob: {
      type: String,
    },
    docs: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("labtest", testSchema);
