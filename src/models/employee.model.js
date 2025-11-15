const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ServerConfig } = require("../config");

const employeeSchema = new Schema(
  {
    empId: {
      type: String,
      required: [true, "Employee ID is required"],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "name is required"],
      minLength: [3, "name must be at least 3 characters long"],
      maxLength: [50, "name must be at most 50 characters long"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Enter a valid email address",
      ],
    },
    phone: {
      type: String,
      required: [true, "phone number is required"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minLength: [8, "password must be at least 8 characters long"],
    },
    profile: {
      type: String,
      default: null,
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    designation: {
      type: String,
      required: [true, "designation is required"],
      trim: true,
    },
    joiningDate: {
      type: Date,
      required: [true, "joining date is required"],
    },
    baseSalary: {
      type: Number,
      required: [true, "base salary is required"],
    },
    address: {
      type: String,
      required: [true, "address is required"],
      trim: true,
    },
    bankName: {
      type: String,
      required: [true, "bank name is required"],
      trim: true,
    },
    accountNumber: {
      type: String,
      required: [true, "account number is required"],
      trim: true,
    },
    ifscCode: {
      type: String,
      required: [true, "IFSC code is required"],
      trim: true,
    },
    panNumber: {
      type: String,
      required: [true, "PAN number is required"],
      trim: true,
    },
    emergencyContact: {
      type: String,
      required: [true, "emergency contact number is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "RESIGNED"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

employeeSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

employeeSchema.methods = {
  comparePassword: async function (plainPassword) {
    return await bcrypt.compare(plainPassword, this.password);
  },

  generateJWTToken: async function () {
    return await jwt.sign(
      {
        id: this._id,
        email: this.email,
        phone: this.phone,
      },
      ServerConfig.JWT.SECRET,
      {
        expiresIn: ServerConfig.JWT.EXPIRES_IN,
      }
    );
  },
};

const Employee = model("Employee", employeeSchema);

module.exports = Employee;
