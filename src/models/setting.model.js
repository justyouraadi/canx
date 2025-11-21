const { Schema, model } = require("mongoose");

const settingSchema = new Schema({
  perKmFare: {
    type: Number,
    required: true,
  },
});

const Setting = model("Setting", settingSchema);

module.exports = Setting;
