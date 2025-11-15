const { Schema, model } = require("mongoose");

const departMentSchema = new Schema({
  name: {
    type: String,
    required: [true, "name is required"],
    minLength: [3, "name must be at least 3 characters long"],
    maxLength: [50, "name must be at most 50 characters long"],
    unique: true,
    trim: true,
  },
}, { timestamps: true });

const Department = model("Department", departMentSchema);

module.exports = Department;