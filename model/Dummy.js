const { default: mongoose } = require("mongoose");

const dummySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    profile: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("dummy", dummySchema);
