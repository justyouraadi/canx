const { Schema, model } = require("mongoose");

const visitSchema = new Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    purpose: {
      type: String,
      enum: ["PAYMENT", "ORDER"],
      required: true,
    },
    clientName: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentMode: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Visit = model("Visit", visitSchema);

module.exports = Visit;
