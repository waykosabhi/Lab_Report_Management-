const { default: mongoose } = require("mongoose");

const pathologySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    pathologyName: {
      type: String,
    },
    mobile: {
      contactType: String,
      contactNumber: Number,
    },
    password: {
      type: String,
    },
    email: {
      type: String,
    },
    address: {
      type: String,
    },
    avatar: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("pathology", pathologySchema);
