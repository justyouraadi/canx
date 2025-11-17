const { Schema, model } = require("mongoose");

const locationSchema = new Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
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

const Location = model("Location", locationSchema);

module.exports = Location;
