const { StatusCodes } = require("http-status-codes");
const { EmployeeService } = require("../service");
const { SuccessResponse, ErrorResponse } = require("../utils/common");

const employeeService = new EmployeeService();

async function create(req, res) {
  try {
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
      status: req.query.status,
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

async function updateStatus(req, res) {
  try {
    const response = await employeeService.updateStatus({
      id: req.body.id,
      status: req.body.status,
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

async function updateDetails(req, res) {
  try {
    const response = await employeeService.updateDetails(req.body.id, {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
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

async function updatePassword(req, res) {
  try {
    const response = await employeeService.updatePassword(req.body.id, {
      password: req.body.password,
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

async function getDashboardDetails(req, res) {
  try {
    const response = await employeeService.getDashboardDetails();
    SuccessResponse.message = "Successfully completed the request";
    SuccessResponse.data = response;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.message = "Something went wrong";
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

async function exportEmployees(req, res) {
  try {
    const response = await employeeService.exportToExcel({
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    });
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + `employees_export_${Date.now()}.xlsx`,
    );

    await response.xlsx.write(res);
    return res.end();
  } catch (error) {
    ErrorResponse.message = "Failed to export employee details";
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

module.exports = {
  create,
  getAll,
  getById,
  signIn,
  getProfile,
  updateStatus,
  updateDetails,
  updatePassword,
  getDashboardDetails,
  exportEmployees
};
