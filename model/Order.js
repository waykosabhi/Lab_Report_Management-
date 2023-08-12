const { default: mongoose } = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Types.ObjectId,
      ref: "doctor",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    test: [
      {
        testId: {
          type: mongoose.Types.ObjectId,
          ref: "labtest",
        },
        price: Number,
      },
    ],
    docs: [String],
    pathology: {
      type: mongoose.Types.ObjectId,
      ref: "pathology",
    },
    status: {
      type: String,
      enum: ["init", "assigned", "accept", "complete", "settled"],
      default: "init",
    },
    reports: {
      type: [String],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", orderSchema);
