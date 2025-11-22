const { Schema, model } = require("mongoose");

const attendanceSchema = new Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    checkInTime: {
      type: Date,
      required: true,
    },
    checkOutTime: {
      type: Date,
      default: null,
    },
    totalDistance: {
      type: Number,
      default: 0,
    },
    totalFare: {
      type: Number,
      default: 0,
    },
    perKmFare: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

const Attendance = model("Attendance", attendanceSchema);

module.exports = Attendance;
