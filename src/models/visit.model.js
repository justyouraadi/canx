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
      enum: ["PAYMENT", "ORDER", "OTHER"],
      required: true,
    },
    dealerName: {
      type: String,
      required: true,
    },
    asset: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      // required: true,
    },
    paymentMode: {
      type: String,
      // required: false,
    },
    description: {
      type: String,
      // required: true,
    },
     latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    deviceTimestamp: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Visit = model("Visit", visitSchema);

module.exports = Visit;
