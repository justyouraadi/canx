const { Schema, model } = require("mongoose");

const claimSchema = new Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    response: {
      type: String,
      default: null,
    },
    bill: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Claim = model("Claim", claimSchema);

module.exports = Claim;
