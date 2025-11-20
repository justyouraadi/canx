const { StatusCodes } = require("http-status-codes");
const { EmployeeService } = require("../service");
const { SuccessResponse, ErrorResponse } = require("../utils/common");

const employeeService = new EmployeeService();

async function create(req, res) {
  try {
    console.log("file",req.file);
    const response = await employeeService.create({
      empId: req.body.empId,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
      profile: req.file ? req.file.filename : null,
      department: req.body.department,
      designation: req.body.designation,
      joiningDate: req.body.joiningDate,
      baseSalary: req.body.baseSalary,
      address: req.body.address,
      bankName: req.body.bankName,
      accountNumber: req.body.accountNumber,
      ifscCode: req.body.ifscCode,
      panNumber: req.body.panNumber,
      emergencyContact: req.body.emergencyContact,
    });
    SuccessResponse.message = "Successfully completed the request";
    SuccessResponse.data = {};
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.message = "Something went wrong";
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

async function getAll(req, res) {
  try {
    const response = await employeeService.getAll({
      name: req.query.name,
      page: req.query.page,
      limit: req.query.limit,
    });
    SuccessResponse.message = "Successfully completed the request";
    SuccessResponse.data = response;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.message = "Something went wrong";
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

async function getById(req, res) {
  try {
    const response = await employeeService.getById(req.params.id);
    SuccessResponse.message = "Successfully completed the request";
    SuccessResponse.data = response;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.message = "Something went wrong";
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

async function signIn(req, res) {
  try {
    const response = await employeeService.signIn({
      phone: "+91" + req.body.phone,
      password: req.body.password,
    });
    SuccessResponse.message = "Successfully completed the request";
    SuccessResponse.data = response;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.message = "Something went wrong";
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

async function getProfile(req, res) {
  try {
    SuccessResponse.message = "Successfully completed the request";
    SuccessResponse.data = req.employee;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.message = "Something went wrong";
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

module.exports = {
  create,
  getAll,
  getById,
  signIn,
  getProfile
};
