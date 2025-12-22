const { Schema, model } = require("mongoose");

const slipSchema = new Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    month: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    travelAllowance: {
      type: Number,
      required: true,
    },
    workingDays: {
      type: Number,
      required: true,
    },
    bonus: {
      type: Number,
      required: false,
      default: 0,
    },
    deductions: {
      type: Number,
      required: false,
      default: 0,
    },
    grossSalary: {
      type: Number,
      required: true,
    },
    netSalary: {
      type: Number,
      required: true,
    },
    slipGeneratedOn: {
      type: Date,
      required: true,
      default: Date.now,
    },
    slipFileUrl: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Draft", "Generated"],
      default: "Draft",
    },
  },
  { timestamps: true }
);

const Slip = model("slip",slipSchema)

module.exports = Slip;
