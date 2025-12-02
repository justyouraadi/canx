const { Schema, model } = require("mongoose");

const offlineModel = new Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
  },
  { timestamps: true }
);

const Offline = model("Offline", offlineModel);

module.exports = Offline;
